from django.http import JsonResponse
from django.views import generic
from django.shortcuts import get_object_or_404


from models import Profession, Zob, Dia, MtestData

def uib_view(request, model, param, *args, **kwargs):
	data = ''
	if model == 'posady':
		data = Profession.objects.values_list(param)
	elif model == 'dii':
		data = Dia.objects.values_list(param)
	elif model == 'zob':
		data = Zob.objects.values_list(param)
	else:
		data = ['','']

	data = ["".join(i) for i in data]
	return JsonResponse(tuple(data), safe=False)


def mtest_get(request, pk):
	data1 = get_object_or_404(MtestData, pk=pk)
	return JsonResponse(data1.content, safe=False)