from __future__ import unicode_literals
import uuid
from django.db import models
from django.utils import timezone
from django.utils.encoding import python_2_unicode_compatible


class Profession(models.Model):
	class Meta:
		verbose_name = 'Profession'
		verbose_name_plural = 'Professions'

	def __str__(self):
		return self.prof_name

	prof_name = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')


class Zob(models.Model):
	class Meta:
		verbose_name = 'Duty'
		verbose_name_plural = 'Duties'

	def __str__(self):
		return self.zob_name

	zob_name = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')

class Dia(models.Model):
	class Meta:
		verbose_name = 'Procedure'
		verbose_name_plural = 'Procedures'

	def __str__(self):
		return self.dia_name

	dia_name = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')



@python_2_unicode_compatible
class MtestData(models.Model):
	def __str__(self):
		return str(self.mid)

	mid = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
	author = models.CharField(max_length=200)
	content = models.TextField(default='')
	pub_date = models.DateTimeField('date published')