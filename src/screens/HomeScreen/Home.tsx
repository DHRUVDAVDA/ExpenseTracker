import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExpenseType } from '../../store/slices';
import moment from 'moment';

export const BottomAddBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <TouchableOpacity style={styles.btnView} onPress={onClick}>
      <Text style={styles.btnText}>Add Expense</Text>
    </TouchableOpacity>
  );
};

export const ExpenseList = ({
  expenses,
  onSelectExpense,
  history,
}: {
  expenses: ExpenseType[];
  onSelectExpense: (expense: ExpenseType) => void;
  history?: boolean;
}) => {
  const [expenseToShow, setExpenseToShow] = useState<ExpenseType[]>(expenses);

  useEffect(() => {
    if (history) {
      let sevenDaysAgoDate = moment().subtract(7, 'days');
      const filteredExpenses = expenses.filter(expense =>
        moment(expense.createdAt * 1000).isAfter(sevenDaysAgoDate),
      );
      setExpenseToShow(
        filteredExpenses.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        }),
      );
    } else {
      const filteredExpenses = expenses.filter(expense => !!expense);
      setExpenseToShow(
        filteredExpenses.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        }),
      );
    }
  }, [expenses, history]);

  return (
    <View style={styles.listContainer}>
      {history && (
        <Text style={styles.listContainerTitle}>Last 7 Days Expenses</Text>
      )}
      <FlatList
        data={expenseToShow}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => {
          return (
            <View style={{ alignItems: 'center', padding: 20, paddingTop: 50 }}>
              <Text style={styles.noExpenseText}>No expenses found</Text>
            </View>
          );
        }}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => onSelectExpense(item)}
              style={styles.expenseItem}
            >
              <View>
                <Text style={styles.categoryTxt}>{item?.category}</Text>
                <Text style={styles.noteTxt}>{item?.note}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.amountTxt}>{item?.amount}</Text>
                <Text style={styles.amountTxt}>
                  {moment(item?.createdAt * 1000).format('DD MMM')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export const SummaryList = ({ expenses }: { expenses: ExpenseType[] }) => {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const HighestExpense = expenses.map(expense => {
    let max = 0;
    if (expense.amount > max) {
      max = expense.amount;
    }
    return max;
  });

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listContainerTitle}>
        Total Transactions: {expenses.length}
      </Text>
      <Text style={styles.listContainerTitle}>
        Total Expense: {totalExpenses}
      </Text>
      <Text style={styles.listContainerTitle}>
        Highest Expense: {Math.max(...HighestExpense)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  btnView: {
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 30,
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContainer: {
    width: '100%',
    padding: 20,
  },
  listContainerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  categoryTxt: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountTxt: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteTxt: {
    fontSize: 14,
    color: 'gray',
  },
  noExpenseText: {
    fontSize: 16,
    color: 'gray',
  },
  deleteBtnText: {
    color: 'red',
    marginTop: 5,
  },
});
