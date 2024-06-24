from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Chat
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.authentication import JWTAuthentication
import openai
class ChatWithGPTView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message')

        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            openai.api_key = settings.OPENAI_API_KEY
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message},
                ]
            )

            gpt_response = response.choices[0].message['content']

            # Save the chat to the database
            Chat.objects.create(user=request.user, message=user_message, response=gpt_response)

            return Response({"response": gpt_response})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatHistoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = Chat.objects.filter(user=request.user).order_by('-timestamp')
        chat_history = [{"message": chat.message, "response": chat.response, "timestamp": chat.timestamp} for chat in chats]
        return Response(chat_history, status=status.HTTP_200_OK)
# class ChatWithLLMView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         HUGGING_FACE_API_KEY="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"
#         user_message = request.data.get('message')

#         if not user_message:
#             return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             response = requests.post(
#                 'https://api-inference.huggingface.co/models/your-model-name',  # Replace with the actual model URL
#                 headers={'Authorization': f'Bearer {HUGGING_FACE_API_KEY}'},
#                 json={"inputs": user_message}
#             )

#             if response.status_code == 200:
#                 llm_response = response.json()
#                 return Response({"response": llm_response['generated_text']})
#             else:
#                 print(f"Error: {response.status_code} - {response.content}")
#                 return Response({"error": "Failed to get a response from the LLM API"}, status=response.status_code)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)