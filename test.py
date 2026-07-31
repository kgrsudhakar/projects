def cache(stream, capacity):
    test = []
    for item in stream:
        if item in test:
            test.remove(item)
            cache.append(item)
        else:
        if len(test) == capacity:
           test.pop(0)


           from django.http import JsonResponse
 
def book_list(request):
    books = Book.objects.all()  
 
    data = []
 
    for book in books:
        data.append({
            "title": book.title,
            "author": book.author.name,  
        })
 
    return JsonResponse(data, safe=False)


 