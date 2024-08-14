from django.db import models
import uuid
from django.contrib.auth import get_user_model

class GuestEmergencyContact(models.Model):
    class RelationChoices(models.TextChoices):
        SPOUSE = "Spouse", "Spouse"
        FRIEND = "Friend", "Friend"
        PARENT = "Parent", "Parent"
        OTHER = "Other", "Other"
    name = models.CharField(max_length=200)
    tel = models.CharField(max_length=10)
    relationship = models.CharField(max_length=100, choices=RelationChoices.choices)
    other = models.CharField(max_length=100, null=True, blank=True)

class Guest(models.Model):
    class Gender_Choices(models.TextChoices):
        MALE = "Male", "Male"
        FEMALE = "Female", "Female"
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=100, choices= Gender_Choices.choices)
    mobile = models.CharField(max_length=10)
    emergency_name = models.CharField(max_length=200, null=True, blank=True, default="None")
    emergency_tel = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateField(auto_now_add = True)
    updated_on = models.DateField(auto_now_add = True)
    has_paid = models.BooleanField(default=False)
    has_fully_paid = models.BooleanField(default=False)
    is_booked = models.BooleanField(default= False)
    added_by = models.ForeignKey(get_user_model(), on_delete = models.PROTECT, default=1)
    profile_pic =models.ImageField(upload_to="guests/", blank=True, null=True)

    def __str__(self):
        return self.last_name
    
    @property
    def guest_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Room(models.Model):
    class ROOM_TYPE_CHOICES(models.TextChoices):
        SINGLE = "Double-sized", "Double-sized"
        DOUBLE = "Queen-sized", "Queen-sized"

    class ROOM_STATUS_CHOICES(models.TextChoices):
        AVAILABLE = "Available", "Available"
        OCCUPIED = "Occupied", "Occupied"
        MAINTENANCE = "Maintenance", "Maintenance"


    room_number = models.CharField(max_length=100, unique=True)
    room_type = models.CharField(max_length=100, choices=ROOM_TYPE_CHOICES.choices)
    price_per_night = models.DecimalField(max_digits = 10, decimal_places = 2)
    room_status = models.CharField(max_length=100, choices= ROOM_STATUS_CHOICES.choices)
    description = models.TextField()
    created_at = models.DateField(auto_now_add = True)

    def __str__(self):
        return self.room_type
    
class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        CONFIRMED = "Confirmed", "Confirmed"
        CANCELLED = "Cancelled", "Cancelled"
        CHECKEDOUT = "CheckedOut", "CheckedOut"
    guest = models.ForeignKey(Guest, on_delete = models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    date_checked_in = models.DateField()
    date_checked_out =models.DateField()
    booking_status = models.CharField(max_length=100, choices= BookingStatus.choices)
    total_amount = models.DecimalField(max_digits=10, decimal_places = 2)
    created_at = models.DateField(auto_now_add = True)
    dated = models.DateField(blank=True, null = True,)
    booked_by = models.ForeignKey(get_user_model(), on_delete = models.PROTECT, default=1)

    def __str__(self):
        return str(self.guest)


class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        VIRTUAL = "Virtual", "Virtual"
        CASH = "Cash", "Cash"
    class PaymentStatus(models.TextChoices):
        FULLYPAID = "Fully-Paid", "Fully-Paid"
        PENDING = "Pending", "Pending"
        FAILED = "Failed", "Failed"
        PARTPAYMENT = "Part-Payment", "Part-Payment"
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, default=1)
    payment_date = models.DateField(auto_now_add = True)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default="0.00")
    initial_payment = models.DecimalField(max_digits=10, decimal_places=2, default="0.00")
    final_payment = models.DecimalField(max_digits=10, decimal_places=2, default="0.00" )
    payment_method = models.CharField(max_length=100, choices = PaymentMethod.choices, default=PaymentMethod.CASH)
    payment_verified = models.BooleanField(default=False)
    payment_status = models.CharField(max_length=100, choices = PaymentStatus.choices, default = PaymentStatus.FULLYPAID)
    account_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, default=1)
    created_at = models.DateField(auto_now_add=True, blank=False, null=False)
    date_updated = models.DateField(auto_now = True)

    def __str__(self):
        return str(self.amount)
    
    @property
    def balance(self):
        if self.initial_payment and self.final_payment:
            return self.amount - (self.initial_payment + self.final_payment)
        return 0.00
    
    @property
    def total_amount_paid(self):
        if self.final_payment and self.initial_payment:
            tot = self.initial_payment + self.final_payment
            return tot    

