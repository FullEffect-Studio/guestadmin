from rest_framework import serializers
from .models import *
from decimal import Decimal

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = "__all__"
class GuestPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        exclude = ["email", "first_name", "gender", "has_paid", "last_name", "mobile", "town_from", "updated_on", "guest_full_name"]

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

class BookingListSerializer(serializers.ModelSerializer):
    guest_id = serializers.IntegerField(source="guest.id")
    guest_name = serializers.CharField(source="guest.guest_full_name", read_only=True)
    guest_full_name = serializers.SerializerMethodField()
    guest_mobile = serializers.CharField(source="guest.mobile", read_only=True)
    guest_email = serializers.CharField(source="guest.email", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)
    room_type = serializers.CharField(source="room.room_type")
    room_price_per_night = serializers.CharField(source="room.price_per_night")
    guest_has_paid = serializers.BooleanField(source="guest.has_paid")
    guest_is_booked = serializers.BooleanField(source="guest.is_booked")
    is_booked_guest = serializers.SerializerMethodField()
    guest_payment_status = serializers.SerializerMethodField()
    booked_by = serializers.SerializerMethodField()


    def get_booked_by(self, obj):
        return obj.booked_by.full_name
    
    def get_is_booked_guest(self, obj):
        if obj.guest.is_booked:
            return "Yes"
        return "No"

    def get_guest_payment_status(self, obj):
        if obj.guest.has_paid == True:
            return "Paid"
        else: 
            return "Not Paid"

    def get_guest_full_name(self, obj):
        return f"{obj.guest.first_name} {obj.guest.last_name}"

    class Meta:
        model = Booking
        fields = ['id','guest_id','guest_name', "guest_email","guest_full_name","is_booked_guest","guest_is_booked",'guest_mobile','room_number','room_type', 'total_amount', 'date_checked_in',"guest_payment_status",'guest_has_paid','date_checked_out','room_price_per_night', 'booking_status', 'created_at', 'booked_by']

class PaymentSerializer(serializers.ModelSerializer):
    paying_guest_id = serializers.SerializerMethodField()
    guess_name = serializers.CharField(source="booking.guest.guest_full_name")
    guess_mobile = serializers.CharField(source="booking.guest.mobile")
    booking_id = serializers.IntegerField(source="booking.id")
    booking_amount = serializers.DecimalField(source="booking.total_amount", max_digits=100, decimal_places=2)
    guess_has_paid = serializers.SerializerMethodField()
    guest_has_fully_paid = serializers.SerializerMethodField()
    amountPayed = serializers.DecimalField(source = "amount", max_digits=30, decimal_places=2 )
    accountant = serializers.SerializerMethodField()
    payment_balance = serializers.SerializerMethodField()
    final_payment_balance = serializers.SerializerMethodField()
    _intial_payment = serializers.DecimalField(source="initial_payment", max_digits=30, decimal_places=2)
    _final_payment = serializers.DecimalField(source="final_payment", max_digits=30, decimal_places=2)
    total_payment__made = serializers.SerializerMethodField()

    def get_paying_guest_id(self, obj):
        return obj.booking.guest.id

    def get_payment_balance(self, obj):
        if obj.initial_payment:
            return obj.amount - obj.initial_payment
        
    def get_final_payment_balance(self, obj):
        final_payment = obj.final_payment if obj.final_payment is not None else Decimal('0.00')
        return obj.amount - obj.initial_payment - final_payment
        
    def get_total_payment__made(self, obj):
        if obj.initial_payment and obj.final_payment:
            return obj.initial_payment + obj.final_payment


    def get_accountant(self, obj):
        return obj.account_by.full_name

    def get_guess_has_paid(self, obj):
        if obj.booking.guest.has_paid == True:
            return "Yes"
        return "Nope"
    
    def get_guest_has_fully_paid(self, obj):
        if obj.booking.guest.has_fully_paid == True:
            return "Yes"
        return "Nope"
    
    class Meta:
        model = Payment 
        fields = ['id',"paying_guest_id",'payment_method','_final_payment','final_payment_balance',"total_payment__made","guest_has_fully_paid",'accountant','amountPayed','_intial_payment',"payment_balance",'booking_id',"guess_mobile",'guess_name','guess_has_paid', "booking_amount", "payment_reference", 'payment_status', "payment_date", "date_updated"]
        read_only_fields = ["transaction_id", 'payment_status', "payment_date","account_by" ]

class MainPaymentSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Payment
        exclude = ["payment_date"]

class InitializePaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class BookingTrendingSerializer(serializers.Serializer):
    created_at = serializers.DateField()
    NumberOfBookings = serializers.IntegerField()

class GetUpcomingBookingSerializer(serializers.Serializer):
    date = serializers.DateField()

class GuestIsBookedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ["id","is_booked"]



    