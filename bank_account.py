class BankAccount:

    def __init__(self, account_holder, balance=0):
        self.account_holder = account_holder
        self._balance = balance

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"₹{amount} deposited successfully.")
        else:
            print("Deposit amount must be greater than 0.")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be greater than 0.")
        elif amount > self._balance:
            print("Insufficient balance.")
        else:
            self._balance -= amount
            print(f"₹{amount} withdrawn successfully.")

    def check_balance(self):
        print(f"Current Balance: ₹{self._balance}")


# Create an object
account = BankAccount("John", 1000)

# Check initial balance
account.check_balance()

# Deposit money
account.deposit(500)

# Check balance
account.check_balance()

# Withdraw money
account.withdraw(300)

# Check balance
account.check_balance()

# Try to withdraw more than the balance
account.withdraw(5000)