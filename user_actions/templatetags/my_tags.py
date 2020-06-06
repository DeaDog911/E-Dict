from django.template import Library

register = Library()

@register.filter_function
def order_by(queryset, args):
    args = [x.strip() for x in args.split(',')]
    return queryset.order_by(*args)

@register.simple_tag
def set_correct_order_dicts(order, request):
    request_order = request.GET.get('dicts_order_by', order)
    if request_order.startswith('-'):
        return request_order[1::]
    else:
        order = f'-{order}'
        return order

@register.simple_tag
def set_correct_order_words(order, request):
    request_order = request.GET.get('order_by', order)
    if request_order.startswith('-'):
        return request_order[1::]
    else:
        order = f'-{order}'
        return order