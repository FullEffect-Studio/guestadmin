from django.contrib import admin
from .models import Guest, Room, Booking, Payment

class GuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name','mobile','emergency_name','emergency_tel', 'has_paid', 'is_booked', 'added_by', 'created_at']

admin.site.register(Guest, GuestAdmin)

class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'room_type', 'room_status', 'price_per_night']

admin.site.register(Room, RoomAdmin)

class BookingAdmin(admin.ModelAdmin):
    list_display = ['guest', 'room', 'date_checked_in', 'date_checked_out', 'total_amount', 'booked_by']

admin.site.register(Booking, BookingAdmin)


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['booking', 'payment_date', 'amount', 'account_by', 'payment_status']

admin.site.register(Payment, PaymentAdmin)