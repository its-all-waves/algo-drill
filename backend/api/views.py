from django.http import JsonResponse
from django.shortcuts import render

def test(request):
	return JsonResponse({'message': 'hello from Django!'})
