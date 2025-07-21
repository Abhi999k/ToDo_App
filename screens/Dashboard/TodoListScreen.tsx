import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

export default function ToDoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<any[]>([]);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, 'ToDos'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(list);
    });

    return unsubscribe;
  }, [uid]);

  const handleAddTodo = async () => {
    if (task.trim() === '') return;

    await addDoc(collection(db, 'ToDos'), {
      text: task,
      completed: false,
      uid,
      createdAt: serverTimestamp(),
    });

    setTask('');
  };

  const toggleComplete = async (id: string, current: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate toggle
    await updateDoc(doc(db, 'ToDos', id), {
      completed: !current,
    });
  };

  const deleteTodo = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate delete
    await deleteDoc(doc(db, 'ToDos', id));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.todoItem}>
      <Pressable onPress={() => toggleComplete(item.id, item.completed)} style={[
        styles.checkbox,
        item.completed && styles.checkedBox,
      ]}>
        {item.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
      </Pressable>
      <Text style={[styles.todoText, item.completed && styles.completed]}>{item.text}</Text>
      <Pressable onPress={() => deleteTodo(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#333" />
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>My Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={task}
          onChangeText={setTask}
        />
        <Pressable style={styles.addButton} onPress={handleAddTodo}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const BLUE = '#2F80ED';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BLUE,
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: BLUE,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BLUE,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: BLUE,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#333',
  },
});
