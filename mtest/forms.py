from django import forms

from .models import MtestData

class PostForm(forms.ModelForm):

	def __init__(self, *args, **kwargs):
		super(PostForm, self).__init__(*args, **kwargs)
		self.fields['author'].widget.attrs.update({'ng-model': 'author'})
		self.fields['content'].widget.attrs.update({'ng-model': 'content'})

	class Meta:
		model = MtestData
		fields = ('author', 'content')


class EmailForm(forms.Form):
      author = forms.CharField(max_length=255)
      emailfrom = forms.EmailField()
      emailfor = forms.EmailField()
      message = forms.CharField()