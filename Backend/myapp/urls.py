from django.urls import path
from .views import RegisterView, LoginView, LogoutView,ChatWithGPTView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('chat-with-llm/', ChatWithLLMView.as_view(), name='chat_with_llm'),
    path('chat-with-gpt/', ChatWithGPTView.as_view(), name='chat_with_gpt'),
]
