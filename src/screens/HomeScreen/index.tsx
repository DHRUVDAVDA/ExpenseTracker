import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomAddBtn, ExpenseList, SummaryList } from './Home';
import { AddExpenseScreen, Categories } from '../AddExpense';
import { useSelector } from 'react-redux';
import { ExpenseType } from '../../store/slices';

export const HomeScreen = () => {
  const expenses = useSelector((state: any) => state.expenses);
  const [filteredExpenses, setFilteredExpenses] =
    useState<ExpenseType[]>(expenses);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>(
    null,
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isAddExpenseVisible, setIsAddExpenseVisible] =
    useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<
    'expenses' | 'summary' | 'history'
  >('expenses');

  const addExpense = () => {
    return (
      <AddExpenseScreen
        selectedExpense={selectedExpense}
        isVisible={isAddExpenseVisible}
        onCancel={() => {
          setIsAddExpenseVisible(false);
          setSelectedExpense(null);
        }}
      />
    );
  };

  useEffect(() => {
    if (selectedFilter) {
      const filtered = expenses.filter(
        (expense: ExpenseType) => expense.category === selectedFilter,
      );
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedFilter, expenses]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Home Screen</Text>
      {addExpense()}
      <BottomAddBtn onClick={() => setIsAddExpenseVisible(true)} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={[
            styles.tabBtn,
            selectedTab === 'expenses' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('expenses')}
        >
          <Text>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'summary' && styles.activeTab]}
          onPress={() => setSelectedTab('summary')}
        >
          <Text>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text>History</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20, width: '90%' }}>
        <Text style={styles.categoriesTitle}>Categories to filter</Text>
        <FlatList
          horizontal
          data={Categories}
          renderItem={({ item }) => (
            <Text
              onPress={() => {
                if (selectedFilter === item) {
                  setSelectedFilter(null);
                } else {
                  setSelectedFilter(item);
                }
              }}
              style={[
                styles.categoryItem,
                selectedFilter === item && styles.selectedCategory,
              ]}
            >
              {item}
            </Text>
          )}
        />
      </View>
      <View style={{ flex: 1, width: '100%' }}>
        {selectedTab === 'expenses' && (
          <ExpenseList
            expenses={filteredExpenses}
            onSelectExpense={(expense: ExpenseType) => {
              setSelectedExpense(expense);
              setIsAddExpenseVisible(true);
            }}
          />
        )}
        {selectedTab === 'summary' && (
          <SummaryList expenses={filteredExpenses} />
        )}
        {selectedTab === 'history' && (
          <ExpenseList
            history={true}
            expenses={filteredExpenses}
            onSelectExpense={(expense: ExpenseType) => {
              setSelectedExpense(expense);
              setIsAddExpenseVisible(true);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  tabBtn: {
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'gray',
  },
  summaryBtn: {
    flex: 1,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    marginRight: 10,
    fontSize: 14,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: 'gray',
    color: 'white',
  },
});
