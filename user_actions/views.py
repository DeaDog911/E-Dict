from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class Profile_View(LoginRequiredMixin, TemplateView):
    login_url = 'login'

    template_name = 'user_actions/profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data.get('email')
        username = data.get('username')
        user = request.user

        user.email = email
        user.username = username

        user.save()

        return redirect('profile_url')
