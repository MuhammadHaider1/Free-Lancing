from django.core.management.base import BaseCommand
from orders.models import Order
from wallet.models import Transaction


class Command(BaseCommand):
    help = "Backfill missing Transaction records for already-completed orders"

    def handle(self, *args, **options):
        completed_orders = Order.objects.filter(status='completed')

        created_count = 0
        skipped_count = 0

        for order in completed_orders:

            # Check karo freelancer ka credit Transaction already exist karta hai ya nahi
            credit_exists = Transaction.objects.filter(
                order=order,
                user=order.freelancer,
                type='credit'
            ).exists()

            if not credit_exists:
                Transaction.objects.create(
                    user=order.freelancer,
                    order=order,
                    type='credit',
                    amount=order.amount,
                    status='completed',
                    note=f"Payment for Order #{order.id} (backfilled)"
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Created credit Transaction for Order #{order.id} -> {order.freelancer.username}"
                    )
                )
            else:
                skipped_count += 1

            # Check karo client ka debit Transaction already exist karta hai ya nahi
            debit_exists = Transaction.objects.filter(
                order=order,
                user=order.client,
                type='debit'
            ).exists()

            if not debit_exists:
                Transaction.objects.create(
                    user=order.client,
                    order=order,
                    type='debit',
                    amount=order.amount,
                    status='completed',
                    note=f"Payment for Order #{order.id} (backfilled)"
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Created debit Transaction for Order #{order.id} -> {order.client.username}"
                    )
                )
            else:
                skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone! {created_count} Transaction(s) created, {skipped_count} already existed (skipped)."
            )
        )