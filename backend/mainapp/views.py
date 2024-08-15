from rest_framework import generics,views, status, permissions
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.db.models import Q
from django.db.models import Count
from django.db.models import Sum, F
from datetime import datetime 
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .permissions import IsCreator


class RoomListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class RoomRetrieveAPIView(generics.RetrieveAPIView):
    pass

class RoomUpdateAPIView(generics.UpdateAPIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    lookup_field = "pk"

class RoomDestroyAPIview(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    lookup_field = "pk"


class SearchRoomAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RoomSerializer
    def get_queryset(self):
        queryset = Room.objects.all()
        lookup_value = self.kwargs.get('lookup_value', '')

        if lookup_value:
            try:
                lookup_value_float = float(lookup_value)
            except ValueError:
                lookup_value_float = None

            query = Q(room_status__icontains=lookup_value) | Q(room_type__icontains=lookup_value)
            if lookup_value_float is not None:
                query |= Q(price_per_night=lookup_value_float)

            queryset = queryset.filter(query)
        
        if not queryset.exists():
            return Room.objects.none()
        
        return queryset
    
class SearchGuestAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GuestSerializer

    def get_queryset(self):
        queryset = Guest.objects.all()
        lookup_value = self.kwargs.get("lookup_value", "")

        if lookup_value:
            query = Q(first_name__icontains = lookup_value) | Q(last_name__icontains = lookup_value)
            queryset = queryset.filter(query)
        return queryset

class GuestCreateGenericAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GuestSerializer
    queryset = Guest.objects.all()

    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.validated_data
            serializer.save()
            return Response({"message": serializer.data}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response(str(e), status=status.HTTP_502_BAD_GATEWAY)
        
    def get(self, request):
        qs = Guest.objects.all()
        qs_serializer = GuestSerializer(qs, many=True)
        return Response(qs_serializer.data)

class GuestListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GuestSerializer

    def get_queryset(self):
        queryset = Guest.objects.all().filter(added_by=self.request.user)
        return queryset

class GuestUpdateAPIView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GuestSerializer
    queryset = Guest.objects.all()
    lookup_field = "pk"

class GuestDestroyAPIView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GuestSerializer
    queryset = Guest.objects.all()
    lookup_field = "pk"

class BookingSearchAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingListSerializer

    def get_queryset(self):
        lookup_value = self.kwargs.get("lookup_value", "")
        queryset = Booking.objects.filter(guest__first_name__icontains=lookup_value) | Booking.objects.filter(guest__last_name__icontains=lookup_value)
        return queryset

class BookingSearchByID(generics.RetrieveAPIView):
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"
    queryset = Booking.objects.all()

class BookingCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingListSerializer

class BookingListAPIView(generics.ListAPIView):
    permission_classes = [IsCreator]
    serializer_class = BookingListSerializer

    def get_queryset(self):
        today = timezone.now().date()
        user = self.request.user
        if user.is_authenticated:
            return Booking.objects.filter(created_at=today, booked_by=self.request.user)
        return Booking.objects.none()

class BookingMainListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer

class BookingUpdateAPIView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()
    lookup_field = "pk"

    def get_queryset(self):
        today = timezone.now().date()
        return Booking.objects.filter(dated=today)
    
class BookingReportNoFilters(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingListSerializer
    queryset = Booking.objects.all()
    
class BookingsReport(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingListSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        date_filter = self.request.query_params.get('date_filter', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        today = timezone.now().date()

        if date_filter:
            if date_filter == 'today':
                queryset = queryset.filter(created_at__gte=today, created_at__lt=today + timezone.timedelta(days=1))
            elif date_filter == 'yesterday':
                yesterday = today - timezone.timedelta(days=1)
                queryset = queryset.filter(created_at__gte=yesterday, created_at__lt=today)
            elif date_filter == 'last_week':
                start_of_last_week = today - timezone.timedelta(days=today.weekday() + 7)
                end_of_last_week = start_of_last_week + timezone.timedelta(days=7)
                queryset = queryset.filter(created_at__gte=start_of_last_week, created_at__lt=end_of_last_week)
            elif date_filter == 'last_year':
                start_of_last_year = today.replace(year=today.year - 1, month=1, day=1)
                end_of_last_year = today.replace(year=today.year - 1, month=12, day=31) + timezone.timedelta(days=1)
                queryset = queryset.filter(created_at__gte=start_of_last_year, created_at__lt=end_of_last_year)
            else:
                raise ValidationError("Invalid value for date_filter. Valid options are: 'today', 'yesterday', 'last_week', 'last_year'.")

        if start_date and end_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date() + timezone.timedelta(days=1)
                queryset = queryset.filter(created_at__gte=start_date_obj, created_at__lt=end_date_obj)
            except ValueError:
                raise ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
        except ValidationError as e:
            return Response({"detail": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class BookingDeleteAPIView(generics.DestroyAPIView):
    permission_classes =[permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()
    lookup_field = "pk"


class PaymentAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        queryset = Payment.objects.all().order_by("payment_date").filter(account_by=self.request.user)
        return queryset

class PaymentReportNoFilters(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()

class SearchPaymentAPIView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        lookup_value = self.kwargs.get("lookup_value", "")
        queryset = Payment.objects.filter(booking__guest__first_name__icontains = lookup_value) | Payment.objects.filter(booking__guest__last_name__icontains = lookup_value)
        return queryset
    
class PaymentsReport(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        queryset = Payment.objects.all()
        date_filter = self.request.query_params.get('date_filter', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        today = timezone.now().date()

        if date_filter:
            if date_filter == 'today':
                queryset = queryset.filter(payment_date__gte=today, payment_date__lt=today + timezone.timedelta(days=1))
            elif date_filter == 'yesterday':
                yesterday = today - timezone.timedelta(days=1)
                queryset = queryset.filter(payment_date__gte=yesterday, payment_date__lt=today)
            elif date_filter == 'last_week':
                start_of_last_week = today - timezone.timedelta(days=today.weekday() + 7)
                end_of_last_week = start_of_last_week + timezone.timedelta(days=7)
                queryset = queryset.filter(payment_date__gte=start_of_last_week, payment_date__lt=end_of_last_week)
            elif date_filter == 'last_year':
                start_of_last_year = today.replace(year=today.year - 1, month=1, day=1)
                end_of_last_year = today.replace(year=today.year - 1, month=12, day=31) + timezone.timedelta(days=1)
                queryset = queryset.filter(payment_date__gte=start_of_last_year, payment_date__lt=end_of_last_year)
            else:
                raise ValidationError("Invalid value for date_filter. Valid options are: 'today', 'yesterday', 'last_week', 'last_year'.")

        if start_date and end_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date() + timezone.timedelta(days=1)
                queryset = queryset.filter(payment_date__gte=start_date_obj, payment_date__lt=end_date_obj)
            except ValueError:
                raise ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
        except ValidationError as e:
            return Response({"detail": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

        

class PaymentCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MainPaymentSerializer
    queryset = Payment.objects.all().order_by("payment_date")

class PaymentUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = MainPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

class BookingTrendingView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            booking_data = Booking.objects.filter(booked_by=self.request.user).values('created_at').annotate(NumberOfBookings=Count('id'))
            serializer = BookingTrendingSerializer(booking_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TotalBookingAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            booking_total = len(Booking.objects.all().filter(booked_by=self.request.user))
            return Response(booking_total, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"An error occured during response={e}", status=status.HTTP_400_BAD_REQUEST)
        
class TotalRoomsAvailableAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            rooms_avail = Room.objects.filter(room_status = "Available")
            return Response(len(rooms_avail), status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"An error occured: {e}", status=status.HTTP_400_BAD_REQUEST)
        
class TotalNumberOfGuestAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            total_guests = len(Guest.objects.all().filter(added_by=self.request.user))
            return Response(total_guests, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(f"An error occured\nError={e}", status=status.HTTP_400_BAD_REQUEST)
        
class TotalIncomeAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            total_income = Payment.objects.filter(account_by=self.request.user).aggregate(total_icome = Sum(F("initial_payment") + F("final_payment")))
            print(total_income)
            return Response(total_income)
        except Exception as e:
            return Response(f"error occured {e}", status=status.HTTP_400_BAD_REQUEST)

        
class UpComingBookingAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, date):
        try:
            # Convert the date from URL parameter to a date object
            date_obj = datetime.strptime(date, '%d-%m-%Y').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter bookings by the date
        bookings = Booking.objects.filter(date_checked_in=date_obj)
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ClientInDebtAPIView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Payment.objects.filter(account_by = self.request.user, payment_status='Part-Payment')
        return queryset


class UpcomingGuestAPIView(generics.ListAPIView):
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(booked_by=self.request.user, booking_status = "Confirmed", date_checked_in__gt = timezone.now().date())