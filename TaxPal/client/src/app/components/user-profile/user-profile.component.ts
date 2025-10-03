import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isDarkMode: boolean = false;
  currentRoute: string = 'user-profile';
  pageTitle: string = 'Dashboard';
  isAddIncomeModalVisible: boolean = false;
  isAddExpenseModalVisible: boolean = false;
  incomeForm = {
    title: '',
    amount: null as number | null,
    category: '',
    date: '',
    notes: ''
  };
  expenseForm = {
    title: '',
    amount: null as number | null,
    category: '',
    date: '',
    notes: '',
    taxDeductible: ''
  };
  incomeLoading = false;
  expenseLoading = false;
  incomeErrorMsg = '';
  expenseErrorMsg = '';
  incomeSuccessMsg = '';
  expenseSuccessMsg = '';
  userName: string = '';
  userInitial: string = '';
  userEmail: string = '';
  incomeList: any[] = [];
  expenseList: any[] = [];
  recentTransactions: any[] = [];

  // Add these properties to your class
  monthlyData: { month: string; income: number; expense: number }[] = [];
  maxValue = 0;
  yAxisValues: number[] = [];

  // Add these properties for the tooltip
  tooltipStyle = { display: 'none', left: '0px', top: '0px' };
  tooltipData: { month: string, label: string, value: string } = { month: '', label: '', value: '' };

  showProfileMenu: boolean = false; // Add this property

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Get the current route
    const path = this.router.url.split('/')[1] || 'user-profile';
    this.currentRoute = path;
    
    // Set page title
    this.pageTitle = 'Dashboard';
    
    // Check for dark mode
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      document.body.classList.contains('dark-mode');

    this.fetchUserProfile();
    this.fetchIncomeList();
    this.fetchExpenseList();
    this.updateRecentTransactions();

    // Set default date to today for both forms
    const today = this.getCurrentDate();
    this.incomeForm.date = today;
    this.expenseForm.date = today;
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    // Update document classes
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
  
  showAddIncomeModal() {
    this.isAddIncomeModalVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  hideAddIncomeModal(event?: Event) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.isAddIncomeModalVisible = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    } else {
      this.isAddIncomeModalVisible = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  showAddExpenseModal() {
    this.isAddExpenseModalVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  hideAddExpenseModal(event?: Event) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.isAddExpenseModalVisible = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    } else {
      this.isAddExpenseModalVisible = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  submitIncome() {
    // Basic validation only for required fields
    if (!this.incomeForm.title || !this.incomeForm.amount) {
      this.incomeErrorMsg = 'Title and amount are required';
      return;
    }
    
    this.incomeLoading = true;
    this.incomeErrorMsg = '';
    this.incomeSuccessMsg = '';

    // Pre-format the data
    const formData = {
      ...this.incomeForm,
      userEmail: this.userEmail,
      // Ensure amount is numeric
      amount: parseFloat(this.incomeForm.amount?.toString() || '0'),
      // Use current date if not provided
      date: this.incomeForm.date || new Date().toISOString().split('T')[0]
    };

    this.http.post('/api/users/add-income', formData)
      .subscribe({
        next: (response: any) => {
          // Add to local array immediately to avoid refetching
          if (response && response.income) {
            this.incomeList.unshift(response.income);
            this.updateRecentTransactions(); // Update recent transactions list
          }
          
          this.incomeSuccessMsg = 'Income added successfully!';
          this.resetIncomeForm();
          this.hideAddIncomeModal();
          this.incomeLoading = false;
        },
        error: (error) => {
          this.incomeErrorMsg = error.error?.error || 'Failed to add income';
          this.incomeLoading = false;
        }
      });
  }

  submitExpense() {
    // Basic validation only for required fields
    if (!this.expenseForm.title || !this.expenseForm.amount) {
      this.expenseErrorMsg = 'Title and amount are required';
      return;
    }
    
    this.expenseLoading = true;
    this.expenseErrorMsg = '';
    this.expenseSuccessMsg = '';

    // Pre-format the data
    const formData = {
      ...this.expenseForm,
      userEmail: this.userEmail,
      // Ensure amount is numeric
      amount: parseFloat(this.expenseForm.amount?.toString() || '0'),
      // Use current date if not provided
      date: this.expenseForm.date || new Date().toISOString().split('T')[0]
    };

    this.http.post('/api/users/add-expense', formData)
      .subscribe({
        next: (response: any) => {
          // Add to local array immediately to avoid refetching
          if (response && response.expense) {
            this.expenseList.unshift(response.expense);
            this.updateRecentTransactions(); // Update recent transactions list
          }
          
          this.expenseSuccessMsg = 'Expense added successfully!';
          this.resetExpenseForm();
          this.hideAddExpenseModal();
          this.expenseLoading = false;
        },
        error: (error) => {
          this.expenseErrorMsg = error.error?.error || 'Failed to add expense';
          this.expenseLoading = false;
        }
      });
  }
  
  fetchIncomeList() {
    if (!this.userEmail) {
      this.incomeList = [];
      this.updateRecentTransactions();
      return;
    }
    this.http.get<any[]>(`/api/users/income-list?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: (list) => {
        this.incomeList = Array.isArray(list)
          ? list.map(item => ({
              ...item,
              date: item.date ? new Date(item.date) : null
            }))
          : [];
        this.updateRecentTransactions();
        this.prepareChartData(); // Add this line
      },
      error: () => {
        this.incomeList = [];
        this.updateRecentTransactions();
        this.prepareChartData(); // Add this line
      }
    });
  }

  fetchExpenseList() {
    if (!this.userEmail) {
      this.expenseList = [];
      this.updateRecentTransactions();
      return;
    }
    this.http.get<any[]>(`/api/users/expense-list?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: (list) => {
        this.expenseList = Array.isArray(list)
          ? list.map(item => ({
              ...item,
              date: item.date ? new Date(item.date) : null
            }))
          : [];
        this.updateRecentTransactions();
        this.prepareChartData(); // Add this line
      },
      error: () => {
        this.expenseList = [];
        this.updateRecentTransactions();
        this.prepareChartData(); // Add this line
      }
    });
  }
  
  fetchUserProfile() {
    // Get the user email from localStorage instead of making an API call
    this.userEmail = localStorage.getItem('user_email') || '';
    this.userName = localStorage.getItem('user_name') || '';
    this.userInitial = this.userName ? this.userName.trim()[0].toUpperCase() : this.userEmail.trim()[0].toUpperCase();
    
    if (this.userEmail) {
      this.fetchIncomeList();
      this.fetchExpenseList();
    }
  }

  updateRecentTransactions() {
    // Combine income and expense lists
    const allTransactions = [
      ...this.incomeList.map(item => ({...item, type: 'income'})),
      ...this.expenseList.map(item => ({...item, type: 'expense'}))
    ];
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Take only the most recent ones
    this.recentTransactions = allTransactions.slice(0, 5);
  }

  prepareChartData() {
    // Get all months from both income and expense lists
    const monthsSet = new Set<string>();
    
    // Process income dates
    this.incomeList.forEach(income => {
      if (income.date) {
        const date = new Date(income.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(monthYear);
      }
    });
    
    // Process expense dates
    this.expenseList.forEach(expense => {
      if (expense.date) {
        const date = new Date(expense.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(monthYear);
      }
    });
    
    // Convert Set to Array and sort
    const months = Array.from(monthsSet).sort();
    
    // Calculate totals for each month
    this.monthlyData = months.map(month => {
      // Calculate income for this month
      const incomeTotal = this.incomeList
        .filter(income => {
          if (!income.date) return false;
          const date = new Date(income.date);
          const incomeMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return incomeMonth === month;
        })
        .reduce((sum, income) => sum + (income.amount || 0), 0);
      
      // Calculate expenses for this month
      const expenseTotal = this.expenseList
        .filter(expense => {
          if (!expense.date) return false;
          const date = new Date(expense.date);
          const expenseMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return expenseMonth === month;
        })
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      // Format month for display (YYYY-MM to MMM YYYY)
      const [year, monthNum] = month.split('-');
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
      const displayMonth = `${monthName} ${year}`;
      
      return {
        month: displayMonth,
        income: incomeTotal,
        expense: expenseTotal
      };
    });
    
    // Find the maximum value for scaling
    this.maxValue = Math.max(
      1, // Ensure we have a non-zero value for empty data
      ...this.monthlyData.map(data => Math.max(data.income, data.expense))
    );
    
    // Create y-axis values (5 steps)
    this.yAxisValues = [0, this.maxValue / 4, this.maxValue / 2, this.maxValue * 3/4, this.maxValue];
  }
  
  // Add this method to limit the number of months displayed
  getDisplayMonths(): { month: string; income: number; expense: number }[] {
    // If we have 6 or fewer months, show them all
    if (this.monthlyData.length <= 6) {
      return this.monthlyData;
    }
    
    // Otherwise, show the most recent 6 months
    return this.monthlyData.slice(-6);
  }
  
  getBarHeight(value: number): number {
    if (!value || !this.maxValue) return 0;
    return (value / this.maxValue) * 100;
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  }
  
  hasFinancialData(): boolean {
    return this.monthlyData.length > 0 && 
           this.monthlyData.some(data => data.income > 0 || data.expense > 0);
  }
  
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Show tooltip with financial information when hovering over a bar
   */
  showTooltip(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const month = target.getAttribute('data-month') || '';
    const label = target.getAttribute('data-label') || '';
    const value = target.getAttribute('data-value') || '';
    
    // Update tooltip content
    this.tooltipData = { month, label, value };
    
    // Position tooltip next to the cursor
    const offset = 10; // offset from cursor
    this.tooltipStyle = {
      display: 'block',
      left: `${event.clientX + offset}px`,
      top: `${event.clientY - offset}px`
    };
    
    // Add visible class after a small delay to ensure smooth animation
    setTimeout(() => {
      const tooltip = document.getElementById('chart-tooltip');
      if (tooltip) {
        tooltip.classList.add('visible');
      }
    }, 10);
  }
  
  /**
   * Hide tooltip when not hovering over a bar
   */
  hideTooltip() {
    this.tooltipStyle = { display: 'none', left: '0px', top: '0px' };
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  closeProfileMenu() {
    this.showProfileMenu = false;
  }
  
  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    
    // Redirect to the home page
    window.location.href = '/';
  }

  resetExpenseForm() {
    // Reset expense form fields to default values
    this.expenseForm = {
      title: '',
      amount: null,
      category: '',
      date: this.getCurrentDate(),
      notes: '',
      taxDeductible: ''
    };
  }

  resetIncomeForm() {
    // Reset income form fields to default values
    this.incomeForm = {
      title: '',
      amount: null,
      category: '',
      date: this.getCurrentDate(),
      notes: ''
    };
  }
}