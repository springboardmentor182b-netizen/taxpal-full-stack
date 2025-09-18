/// <reference types="jasmine" />
// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent (UI - Income/Expense Modals)', () => {
    let fixture: ComponentFixture<UserProfileComponent>;
    let component: UserProfileComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, UserProfileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Income modal UI', () => {
        it('should open income modal when Add Income button is clicked', () => {
            const incomeBtn = fixture.debugElement.query(By.css('button.income-btn'));
            expect(incomeBtn).toBeTruthy();
            incomeBtn.triggerEventHandler('click', {});
            fixture.detectChanges();

            const modal = fixture.debugElement.query(By.css('.modal-overlay'));
            const title = fixture.debugElement.query(By.css('.modal-header h2'));
            expect(component.isAddIncomeModalVisible).toBeTrue();
            expect(modal).toBeTruthy();
            expect(title.nativeElement.textContent).toContain('Add New Income');
        });

        it('should close income modal when Cancel is clicked', () => {
            component.showAddIncomeModal();
            fixture.detectChanges();

            const cancelBtn = fixture.debugElement.query(By.css('.btn-cancel'));
            cancelBtn.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(component.isAddIncomeModalVisible).toBeFalse();
            const modal = fixture.debugElement.query(By.css('.modal-overlay'));
            expect(modal).toBeFalsy();
        });
    });

    describe('Expense modal UI', () => {
        it('should open expense modal when Add Expense button is clicked', () => {
            const expenseBtn = fixture.debugElement.query(By.css('button.expense-btn'));
            expect(expenseBtn).toBeTruthy();
            expenseBtn.triggerEventHandler('click', {});
            fixture.detectChanges();

            const modals = fixture.debugElement.queryAll(By.css('.modal-overlay'));
            // When expense modal is open, an overlay exists and header should match
            expect(component.isAddExpenseModalVisible).toBeTrue();
            expect(modals.length).toBeGreaterThan(0);
            const header = fixture.debugElement.query(By.css('.modal-header h2'));
            expect(header.nativeElement.textContent).toContain('Add New Expense');
        });

        it('should close expense modal when clicking backdrop (overlay)', () => {
            component.showAddExpenseModal();
            fixture.detectChanges();

            // Click on overlay to close
            const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
            overlay.triggerEventHandler('click', { target: overlay.nativeElement });
            fixture.detectChanges();

            expect(component.isAddExpenseModalVisible).toBeFalse();
            const stillThere = fixture.debugElement.query(By.css('.modal-overlay'));
            expect(stillThere).toBeFalsy();
        });
    });
});


