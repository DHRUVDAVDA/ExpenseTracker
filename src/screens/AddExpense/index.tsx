import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addExpense, ExpenseType, removeExpense } from '../../store/slices';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const Categories: string[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
];

export const AddExpenseScreen = ({
  selectedExpense,
  isVisible,
  onCancel,
}: {
  selectedExpense: ExpenseType | null;
  isVisible: boolean;
  onCancel: () => void;
}) => {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [seleectedCategory, setSelectedCategory] = useState<string>('Other');
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedExpense) {
      setAmount(selectedExpense.amount.toString());
      setNote(selectedExpense.note);
      setSelectedCategory(selectedExpense.category);
    } else {
      setAmount('');
      setNote('');
      setSelectedCategory('Other');
    }
  }, [selectedExpense]);

  const onCancelPress = () => {
    onCancel();
    setAmount('');
    setSelectedCategory('Other');
    setNote('');
  };

  const onSavePress = () => {
    if (!amount) {
      Alert.alert('', 'Please enter amount');
      return;
    }

    let expense = {
      id: selectedExpense ? selectedExpense.id : uuidv4(),
      amount: Number(amount),
      note: note,
      category: seleectedCategory,
      createdAt: selectedExpense ? selectedExpense.createdAt : moment().unix(),
    };
    dispatch(addExpense(expense));
    onCancelPress();
  };

  const onDeletePress = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(removeExpense(selectedExpense?.id));
            onCancelPress();
          },
        },
      ],
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <TextInput
            value={amount}
            placeholder="Add amount"
            placeholderTextColor={'grey'}
            style={styles.inputField}
            keyboardType="number-pad"
            onChangeText={text => {
              setAmount(text);
            }}
          />
          <TextInput
            value={note}
            placeholder="Add note"
            placeholderTextColor={'grey'}
            style={styles.inputField}
            onChangeText={text => {
              setNote(text);
            }}
          />
          <Text style={styles.catTitle}>Select category</Text>
          <FlatList
            data={Categories}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  item === seleectedCategory && { backgroundColor: 'black' },
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.itemTxt,
                    item === seleectedCategory && { color: 'white' },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />
          <View style={styles.btmBtn}>
            <TouchableOpacity onPress={onCancelPress} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSavePress} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
          {selectedExpense && (
            <TouchableOpacity onPress={onDeletePress} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '60%',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputField: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
  catTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  categoryItem: {
    padding: 10,
    width: '45%',
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTxt: {
    fontSize: 16,
    color: 'black',
  },
  btmBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteBtnText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});
