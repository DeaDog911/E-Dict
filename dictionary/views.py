from django.shortcuts import redirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def landing(request):
    if request.user.is_authenticated:
        return redirect('foreign_dict_list_url')
    else:
        return render(request, 'landing.html', context={})
