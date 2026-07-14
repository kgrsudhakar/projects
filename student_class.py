class Student:

    def __init__(self, name, age, course):
        self.name = name
        self.age = age
        self.course = course

    def display(self):
        print("Name :", self.name)
        print("Age :", self.age)
        print("Course :", self.course)


student1 = Student("John", 20, "Python")
student2 = Student("Alice", 22, "Java")
student3 = Student("Sudhakar", 29, "React JS")

student1.display()

print()

student2.display()

print()

student3.display()