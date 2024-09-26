from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class RecurringDetail(BaseModel):
    recurring: bool = Field(..., description="Indicates if the item is recurring")
    frequency: str = Field(..., description="Frequency of the recurring item (e.g., annual, monthly, etc.)")
    recurring_day: Optional[int] = Field(None, description="Day of the month when the item recurs")
    recurring_month: Optional[int] = Field(None, description="Month of the year when the item recurs")
    start_date: Optional[str] = Field(None, description="Start date of the recurring item")
    end_date: Optional[str] = Field(None, description="End date of the recurring item")
    recurring_amount: Optional[float] = Field(None, description="Amount for each recurrence of the item")

class Salary(BaseModel):
    name: str = Field(..., description="Name of the salary income source")
    source: str = Field(..., description="Source of the salary income")
    comments: str = Field(default='', description="Additional comments for the salary income")
    destination_account: Optional[str] = Field(None, description="Destination account for the salary income")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the salary income")

class BusinessIncome(BaseModel):
    name: str = Field(..., description="Name of the business income source")
    source: str = Field(..., description="Source of the business income")
    comments: str = Field(default='', description="Additional comments for the business income")
    destination_account: Optional[str] = Field(None, description="Destination account for the business income")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the business income")

class InvestmentIncome(BaseModel):
    name: str = Field(..., description="Name of the investment income source")
    type: str = Field(..., description="Type of investment income (e.g., interest, dividends, capital gains)")
    comments: str = Field(default='', description="Additional comments for the investment income")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the investment income")

class OtherIncome(BaseModel):
    name: str = Field(..., description="Name of the other income source")
    type: str = Field(..., description="Type of other income (e.g., rental income, royalties)")
    comments: str = Field(default='', description="Additional comments for the other income")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the other income")

class Income(BaseModel):
    salary: List[Salary] = Field(default_factory=list, description="List of salary incomes")
    business_income: List[BusinessIncome] = Field(default_factory=list, description="List of business incomes")
    investment_income: List[InvestmentIncome] = Field(default_factory=list, description="List of investment incomes")
    other_income: List[OtherIncome] = Field(default_factory=list, description="List of other incomes")

class SavingsAccount(BaseModel):
    name: str = Field(..., description="Name of the savings account")
    bank: str = Field(..., description="Bank of the savings account")
    balance: float = Field(..., description="Balance of the savings account")
    interest_rate: Optional[float] = Field(None, description="Interest rate of the savings account")
    comments: str = Field(default='', description="Additional comments for the savings account")

class CheckingAccount(BaseModel):
    name: str = Field(..., description="Name of the checking account")
    bank: str = Field(..., description="Bank of the checking account")
    balance: float = Field(..., description="Balance of the checking account")
    comments: str = Field(default='', description="Additional comments for the checking account")

class RealEstate(BaseModel):
    name: str = Field(..., description="Name of the real estate property")
    address: str = Field(..., description="Address of the real estate property")
    estimated_value: float = Field(..., description="Estimated value of the real estate property")
    mortgage_balance: Optional[float] = Field(None, description="Mortgage balance of the real estate property")
    comments: str = Field(default='', description="Additional comments for the real estate property")

class PersonalProperty(BaseModel):
    name: str = Field(..., description="Name of the personal property")
    type: str = Field(..., description="Type of personal property (e.g., vehicles, valuable items)")
    estimated_value: float = Field(..., description="Estimated value of the personal property")
    comments: str = Field(default='', description="Additional comments for the personal property")

class RetirementAccount(BaseModel):
    name: str = Field(..., description="Name of the retirement account")
    type: str = Field(..., description="Type of retirement account (e.g., 401(k), IRA)")
    balance: float = Field(..., description="Balance of the retirement account")
    contributions: Optional[float] = Field(None, description="Contributions to the retirement account")
    comments: str = Field(default='', description="Additional comments for the retirement account")

class InvestmentAccountSaving(BaseModel):
    name: str = Field(..., description="Name of the investment account")
    type: str = Field(..., description="Type of investment account (e.g., stocks, bonds, mutual funds)")
    balance: float = Field(..., description="Balance of the investment account")
    comments: str = Field(default='', description="Additional comments for the investment account")

class EducationSavings(BaseModel):
    name: str = Field(..., description="Name of the education savings account")
    type: str = Field(..., description="Type of education savings account (e.g., 529 plan, Coverdell ESA)")
    balance: float = Field(..., description="Balance of the education savings account")
    contributions: Optional[float] = Field(None, description="Contributions to the education savings account")
    comments: str = Field(default='', description="Additional comments for the education savings account")

class SavingsAndInvestments(BaseModel):
    retirement_accounts: List[RetirementAccount] = Field(default_factory=list, description="List of retirement accounts")
    investment_accounts: List[InvestmentAccountSaving] = Field(default_factory=list, description="List of investment accounts")
    education_savings: List[EducationSavings] = Field(default_factory=list, description="List of education savings")

class Asset(BaseModel):
    savings_accounts: List[SavingsAccount] = Field(default_factory=list, description="List of savings accounts")
    checking_accounts: List[CheckingAccount] = Field(default_factory=list, description="List of checking accounts")
    real_estate: List[RealEstate] = Field(default_factory=list, description="List of real estate properties")
    personal_property: List[PersonalProperty] = Field(default_factory=list, description="List of personal properties")

class Loan(BaseModel):
    name: str = Field(..., description="Name of the loan")
    type: str = Field(..., description="Type of loan (e.g., student, personal, auto)")
    balance: float = Field(..., description="Balance of the loan")
    interest_rate: float = Field(..., description="Interest rate of the loan")
    minimum_payment: float = Field(..., description="Minimum payment for the loan")
    comments: str = Field(default='', description="Additional comments for the loan")
    source_account: Optional[str] = Field(None, description="Source account for the loan")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the loan")

class CreditCard(BaseModel):
    name: str = Field(..., description="Name of the credit card")
    issuer: str = Field(..., description="Issuer of the credit card")
    balance: float = Field(..., description="Balance of the credit card")
    interest_rate: float = Field(..., description="Interest rate of the credit card")
    minimum_payment: float = Field(..., description="Minimum payment for the credit card")
    comments: str = Field(default='', description="Additional comments for the credit card")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the credit card")

class Mortgage(BaseModel):
    name: str = Field(..., description="Name of the mortgage")
    lender: str = Field(..., description="Lender of the mortgage")
    balance: float = Field(..., description="Balance of the mortgage")
    interest_rate: float = Field(..., description="Interest rate of the mortgage")
    comments: str = Field(default='', description="Additional comments for the mortgage")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the mortgage")

class OtherDebt(BaseModel):
    name: str = Field(..., description="Name of the other debt")
    type: str = Field(..., description="Type of other debt")
    balance: float = Field(..., description="Balance of the other debt")
    interest_rate: float = Field(..., description="Interest rate of the other debt")
    minimum_payment: float = Field(..., description="Minimum payment for the other debt")
    comments: str = Field(default='', description="Additional comments for the other debt")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the other debt")

class Liability(BaseModel):
    loans: List[Loan] = Field(default_factory=list, description="List of loans")
    credit_cards: List[CreditCard] = Field(default_factory=list, description="List of credit cards")
    mortgages: List[Mortgage] = Field(default_factory=list, description="List of mortgages")
    other_debts: List[OtherDebt] = Field(default_factory=list, description="List of other debts")

class NetWorth(BaseModel):
    total_assets: float = Field(..., description="Calculated sum of all assets")
    total_liabilities: float = Field(..., description="Calculated sum of all liabilities")
    net_worth: float = Field(..., description="Total assets minus total liabilities")

class ExpenseItem(BaseModel):
    name: str = Field(..., description="Name of the expense")
    category: str = Field(..., description="Category of the expense (e.g., gas, food, entertainment)")
    comments: str = Field(default='', description="Additional comments for the expense")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the expense")

class Subscription(BaseModel):
    name: str = Field(..., description="Name of the subscription")
    type: str = Field(..., description="Type of subscription (e.g., streaming, memberships)")
    comments: str = Field(default='', description="Additional comments for the subscription")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the subscription")
    source_account: Optional[str] = Field(None, description="Source account for the subscription")

class InsurancePolicy(BaseModel):
    name: str = Field(..., description="Name of the insurance policy")
    type: str = Field(..., description="Type of insurance policy (e.g., health, auto, home)")
    provider: str = Field(..., description="Provider of the insurance policy")
    premium: float = Field(..., description="Premium of the insurance policy")
    coverage_details: str = Field(..., description="Coverage details of the insurance policy")
    comments: str = Field(default='', description="Additional comments for the insurance policy")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the insurance policy")

class Expense(BaseModel):
    expense_items: List[ExpenseItem] = Field(default_factory=list, description="List of expense items")
    subscriptions: List[Subscription] = Field(default_factory=list, description="List of subscriptions")
    insurance_policies: List[InsurancePolicy] = Field(default_factory=list, description="List of insurance policies")

class FinanceManagement(BaseModel):
    management_id: str = Field(..., description="ID of the finance management")
    user_id: str = Field(..., description="User ID associated with the finance management")
    name: str = "Finance Management"
    description: str = "Finance Management"
    start_date: str = Field(..., description="Start date of the finance management")
    end_date: str = Field(..., description="End date of the finance management")
    income: Income = Field(default_factory=Income, description="Income details")
    assets: Asset = Field(default_factory=Asset, description="Assets details")
    savings_and_investments: SavingsAndInvestments = Field(default_factory=SavingsAndInvestments, description="Details of savings and investments")
    liabilities: Liability = Field(default_factory=Liability, description="Liabilities details")
    net_worth: NetWorth = Field(default_factory=NetWorth, description="Net worth details")
    expenses: Expense = Field(default_factory=Expense, description="Expenses details")
    notes: str = Field(default='', description="Additional notes for the finance management")
