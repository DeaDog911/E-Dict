from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.views.generic import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin


class UserCreateView(FormView):
    form_class = UserCreationForm
    success_url = 'login'
    template_name = "registration/registration.html"

    def form_valid(self, form):
        form.save()
        return super(UserCreateView, self).form_valid(form)


class UserChangeView(FormView):
    form_class = UserChangeForm
    success_url = 'profile_url'
    template_name = 'user_actions/profile.html'

    def form_valid(self, form):
        form.save()
        return super(UserChangeView, self).form_valid(form)


# class ProfileView(LoginRequiredMixin, TemplateView):
#     login_url = 'login'
#     template_name = 'user_actions/profile.html'
#
#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         return context
#
#     def post(self, request, *args, **kwargs):
#         data = request.POST
#         email = data.get('email')
#         username = data.get('username')
#         user = request.user
#
#         user.email = email
#         user.username = username
#
#         user.save()
#
#         return redirect('profile_url')


def delete_profile(request):
    user = request.user
    user.delete()
    return redirect('login')
