import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
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
    amount: null,
    category: '',
    date: '',
    notes: ''
  };
  expenseForm = {
    title: '',
    amount: null,
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
    if (!this.incomeForm.title || !this.incomeForm.amount || !this.incomeForm.date || !this.userEmail) {
      this.incomeErrorMsg = 'Please fill all required fields.';
      return;
    }
    this.incomeLoading = true;
    this.incomeErrorMsg = '';
    this.incomeSuccessMsg = '';
    const payload = {
      ...this.incomeForm,
      userEmail: this.userEmail
    };
    this.http.post('/api/users/add-income', payload).subscribe({
      next: (res: any) => {
        this.incomeSuccessMsg = 'Income added!';
        this.fetchIncomeList(); // Refresh table after adding
        setTimeout(() => {
          this.hideAddIncomeModal();
          this.incomeForm = { title: '', amount: null, category: '', date: '', notes: '' };
          this.incomeSuccessMsg = '';
        }, 1200);
      },
      error: (err) => {
        this.incomeErrorMsg = err?.error?.error || 'Failed to add income.';
      },
      complete: () => {
        this.incomeLoading = false;
      }
    });
  }

  submitExpense() {
    if (!this.expenseForm.title || !this.expenseForm.amount || !this.expenseForm.date || !this.userEmail) {
      this.expenseErrorMsg = 'Please fill all required fields.';
      return;
    }
    this.expenseLoading = true;
    this.expenseErrorMsg = '';
    this.expenseSuccessMsg = '';
    const payload = {
      ...this.expenseForm,
      userEmail: this.userEmail
    };
    this.http.post('/api/users/add-expense', payload).subscribe({
      next: (res: any) => {
        this.expenseSuccessMsg = 'Expense added!';
        this.fetchExpenseList(); // Refresh table after adding
        setTimeout(() => {
          this.hideAddExpenseModal();
          this.expenseForm = { title: '', amount: null, category: '', date: '', notes: '', taxDeductible: '' };
          this.expenseSuccessMsg = '';
        }, 1200);
      },
      error: (err) => {
        this.expenseErrorMsg = err?.error?.error || 'Failed to add expense.';
      },
      complete: () => {
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
      },
      error: () => {
        this.incomeList = [];
        this.updateRecentTransactions();
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
      },
      error: () => {
        this.expenseList = [];
        this.updateRecentTransactions();
      }
    });
  }

  fetchUserProfile() {
    this.http.get<any>('/api/users/me').subscribe({
      next: (user) => {
        this.userName = user?.name || '';
        this.userInitial = this.userName ? this.userName.trim()[0].toUpperCase() : '';
        this.userEmail = user?.email || '';
        this.fetchIncomeList();
        this.fetchExpenseList();
      },
      error: () => {
        this.userName = '';
        this.userInitial = '';
        this.userEmail = '';
        this.incomeList = [];
        this.expenseList = [];
        this.updateRecentTransactions();
      }
    });
  }

  updateRecentTransactions() {
    // Merge and sort by date descending, take latest 5
    const txs = [
      ...this.incomeList.map(i => ({
        type: 'income',
        title: i.title,
        amount: i.amount,
        category: i.category,
        date: i.date,
      })),
      ...this.expenseList.map(e => ({
        type: 'expense',
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
      }))
    ];
    this.recentTransactions = txs
      .filter(tx => !!tx.date)
      .sort((a, b) => (b.date as any) - (a.date as any))
      .slice(0, 5);
  }

  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}