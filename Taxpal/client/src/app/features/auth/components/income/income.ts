import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeModal()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="modal-header">
          <h2>Record New Income</h2>
          <p>Add details of your income to track your finance better</p>
        </div>
        
        <div class="form-container">
          <h3>Add Income</h3>
          
          <form (ngSubmit)="onSave()" #incomeForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label for="description">Description</label>
                <input 
                  type="text" 
                  id="description" 
                  [(ngModel)]="formData.description"
                  name="description"
                  placeholder="Eg, Web Design Project"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="amount">Amount</label>
                <div class="amount-input">
                  <span class="currency">$</span>
                  <input 
                    type="number" 
                    id="amount" 
                    [(ngModel)]="formData.amount"
                    name="amount"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select 
                  id="category" 
                  [(ngModel)]="formData.category"
                  name="category"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="business">Business</option>
                  <option value="investment">Investment</option>
                  <option value="bonus">Bonus</option>
                  <option value="gift">Gift</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="date">Date</label>
                <div class="date-input">
                  <input 
                    type="date" 
                    id="date" 
                    [(ngModel)]="formData.date"
                    name="date"
                    required
                  />
                  <svg class="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="notes">Notes (Optional)</label>
              <textarea 
                id="notes" 
                [(ngModel)]="formData.notes"
                name="notes"
                placeholder="Add any Additional notes"
                rows="4"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-save" [disabled]="!incomeForm.form.valid">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./income-modal.css']
})
export class IncomeModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    description: '',
    amount: null,
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  onSave() {
    if (this.formData.description && this.formData.amount && this.formData.category && this.formData.date) {
      this.save.emit({ ...this.formData });
      this.closeModal();
    }
  }

  resetForm() {
    this.formData = {
      description: '',
      amount: null,
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }
}