import { createSlice } from "@reduxjs/toolkit";

export type ExpenseType = {  
    id: string;
    amount: number;
    note: string;
    category: string;
    createdAt: number;
 }

const initialExpenses: ExpenseType[] = [];

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: initialExpenses,
    reducers: {
        addExpense: (state, action) => {
            if (!action.payload) return;
            if(state.find(expense => expense.id === action.payload.id)) {
                return state.map(expense => 
                    expense.id === action.payload.id ? action.payload : expense
                );
            }
            state.push(action.payload);
        },
        removeExpense: (state, action) => {
            return state.filter(expense => expense.id !== action.payload);
        },
        
    },
})

export const { addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
