import common.api_config as APICnf
from api.models import Student
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.serializers import StudentSerializer


class HealthView(APIView):
    '''
    This view provides a get call to know whether the backend is responding or not
    '''
    permission_classes = (IsAuthenticated, )
  
    def get(self, request, format=None):
        res = APICnf.prepareSuccessResponse('Running fine!')
        return res


class UserView(APIView):
    '''
    Send back the user details
    '''
    permission_classes = (IsAuthenticated, )
  
    def get(self, request, format=None):        
        try:
            userInfo = {
                'uname': request.user.username,
                'email': request.user.email,
                'fname': request.user.first_name,
                'lname': request.user.last_name,
            }
            res = APICnf.prepareSuccessResponse(userInfo)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('default')
            

class StudentListView(APIView):
    '''
    This view provides a get & post calls to fetch all Student objects and creat new instance respectively
    '''
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        try:
            students = Student.objects.all()
            serializedData = StudentSerializer(students, many=True)
            res = APICnf.prepareSuccessResponse(serializedData.data)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('dberr_get')
        
    
    def post(self, request):
        try:
            serializedData = StudentSerializer(data=request.data)
            if serializedData.is_valid():
                serializedData.save()
                res = APICnf.prepareSuccessResponse(serializedData.data, 201)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('dberr_post')


class StudentDetailView(APIView):
    '''
    This view provides get, put & del calls, to fetch, update & remove instances respectively 
    '''
    permission_classes = (IsAuthenticated, )

    def fetchRecordBasedOnId(self, id):
        try:
            return Student.objects.get(pk = id)
        except Exception as e:
            raise Exception(str(e))

    
    def get(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            serializedData = StudentSerializer(student)
            res = APICnf.prepareSuccessResponse(serializedData.data)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('dberr_get', 400, str(e))


    def put(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            serializedData = StudentSerializer(student, data=request.data)
            if serializedData.is_valid():
                serializedData.save()
                res = APICnf.prepareSuccessResponse(serializedData.data, 200)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('dberr_put', 400, str(e))


    def delete(self, request, id):
        try:
            student = self.fetchRecordBasedOnId(id)
            serializedData = StudentSerializer(student)
            student.delete()
            res = APICnf.prepareSuccessResponse(serializedData.data, 204)
            return res
        except Exception as e:
            return APICnf.prepareErrorResponse('dberr_del', 400, str(e))
