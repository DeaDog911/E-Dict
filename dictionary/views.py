from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required



def redirect_to_dict(request):
    return redirect('foreign_dict_list_url')
