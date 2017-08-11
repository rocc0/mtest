from django.shortcuts import get_object_or_404, render, redirect
from django.views import generic
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, HttpResponse
from django.template.loader import get_template
from django.template import Context
from django.core.mail import EmailMessage
import pdfkit

from .forms import *
from .models import Profession, MtestData

@csrf_exempt
def mtest_edit(request, pk):
    mtest = get_object_or_404(MtestData, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=mtest)
        if form.is_valid():
            mtest = form.save(commit=False)
            mtest.author = 'Admin'
            mtest.pub_date = timezone.now()
            mtest.save()
            return redirect('mtest_edit', pk=mtest.pk)
    else:
        form = PostForm(instance=mtest)
    response = render(request, 'mtest/index.html', {'form': form})
    response['Redirect-URL'] = pk
    return response

def mtest_add(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = 'Admin'
            post.pub_date = timezone.now()
            post.save()
            response = redirect('mtest_edit', pk=post.pk)
            return response
    else:
        form = PostForm()
    return render(request, 'mtest/index.html', {'form': form})

def sendmail(request):
    if request.method == 'POST':
        form = EmailForm(request.POST)
        template = get_template('mtest/contact_template.html')
        if form.is_valid():
            author = form.cleaned_data['author']
            emailfrom = form.cleaned_data['emailfrom']
            emailfor = form.cleaned_data['emailfor']
            message = form.cleaned_data['message']
            message = message.split('|')
            if message[0] == 'dev':
                devurl = message[-1]
                executors = [[j for j in i.split(',')] for i in message[1].split(';')]
            else:
                devurl = message[0]
                executors = ''
            context = Context({
                'contact_name': author,
                'contact_email': emailfrom,
                'form_content': devurl,
                'exec_content': executors
            })
            if emailfrom == 'mtest@clc.com.ua':
                template = get_template('mtest/corr_template.html')
            elif executors != '':
                template = get_template('mtest/admin_template.html')
            content = template.render(context)
            fullemail = author + " " + "<" + emailfrom + ">"
            try:
                msg = EmailMessage("M-TEST",content,fullemail,[i for i in emailfor.split(',')])
                msg.content_subtype = "html"
                msg.send()
                return HttpResponseRedirect('/email/thankyou/')
            except:
                return HttpResponseRedirect('/email/')
        else:
            return HttpResponseRedirect('/')

def to_pdf(request, pk):
    config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')
    pdf = pdfkit.from_url('http://mtest.com.ua', False, configuration=config)
    response = HttpResponse(pdf,content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="ourcodeworld.pdf"'

    return response



