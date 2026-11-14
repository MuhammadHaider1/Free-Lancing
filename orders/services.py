from django.db import transaction
from rest_framework.exceptions import PermissionDenied

from orders.models import Order
from chat.models import Conversation
from notifications.models import Notification
from projects.models import Proposal


@transaction.atomic
def accept_proposal(proposal, client):
    """Run the full "hiring" flow for accepting a proposal.

    Accepting a proposal is a single logical action that has several effects:
      * every other pending proposal on the project is rejected,
      * the accepted proposal is marked ``accepted``,
      * the project moves to ``in_progress``,
      * an :class:`~orders.models.Order` is created for the freelancer,
      * a :class:`~chat.models.Conversation` is created so both parties can chat,
      * the freelancer is notified.

    Doing it here (instead of duplicating it in two views) keeps the
    ``/projects/proposals/{id}/accept/`` and ``/orders/accept-proposal/``
    endpoints perfectly consistent. Idempotent: accepting twice returns the
    same order without creating duplicates.
    """
    if proposal.project.client_id != client.id:
        raise PermissionDenied("Only the project's client can accept a proposal.")

    project = proposal.project

    # 1. Reject every other still-pending proposal on this project.
    Proposal.objects.filter(
        project=project,
        status='pending',
    ).exclude(id=proposal.id).update(status='rejected')

    # 2. Mark this proposal as accepted.
    if proposal.status != 'accepted':
        proposal.status = 'accepted'
        proposal.save(update_fields=['status'])

    # 3. Move the project forward so it stops accepting new proposals.
    if project.status != 'in_progress':
        project.status = 'in_progress'
        project.save(update_fields=['status'])

    # 4. Create the order (reuse an existing one if it was already created).
    order = Order.objects.filter(proposal=proposal).first()
    created = False
    if order is None:
        order = Order.objects.create(
            proposal=proposal,
            client=project.client,
            freelancer=proposal.freelancer,
            amount=proposal.bid_amount,
        )
        created = True

    # 5. Every order gets exactly one conversation for chat.
    Conversation.objects.get_or_create(order=order)

    # 6. Notify the freelancer once, when the order is first created.
    if created:
        Notification.objects.create(
            user=proposal.freelancer,
            message=f"{client.username} ne aap ka proposal accept kar liya hai",
            notification_type="order",
        )

    return order
