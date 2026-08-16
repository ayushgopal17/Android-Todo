import React, {useState,useEffect} from 'react';
import api from "../Services/api"
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';
type Todo = {
   _id: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  userId: string;
  dateTime: string;
  completed: boolean;
};


const TodoScreen = ({navigation}: any) => {

     const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
 const [deadline, setDeadline] = useState('');
 const [editingTodo, setEditingTodo] = useState<any>(null);
 const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');


  const toggleTodo = async (id: string, completed: boolean) => {
  try {
    await api.patch(`/todos/${id}`, {
      completed: !completed,
    });

    fetchTodos();
  } catch (error: any) {
    console.log(
      'TOGGLE ERROR:',
      error.response?.data || error.message,
    );
  }
};

const handleLogout = async () => {
  await AsyncStorage.removeItem('token');

  navigation.replace('Login');
};

const fetchTodos = async () => {
  try {
    const response = await api.get('/todos');

    console.log('TODOS:', response.data);

    setTodos(response.data.todos);
  } catch (error: any) {
    console.log(
      'TODO ERROR:',
      error.response?.data || error.message,
    );
  }
};
useEffect(() => {
  fetchTodos();
}, []);


 

const addTodo = async () => {
  if (todo.trim() === '') return;

  try {
    setLoading(true);
    setError('');

    if (editingTodo) {
      await api.patch(`/todos/${editingTodo._id}`, {
        title: todo,
        description,
        priority,
        completed: editingTodo.completed,
      });

      setEditingTodo(null);
    } else {
      await api.post('/todos', {
        title: todo,
        description,
        priority,
        completed: false,
      });
    }

    setTodo('');
    setDescription('');
    setPriority('low');
    fetchTodos();

  } catch (error: any) {
    setError(error.response?.data?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

const deleteTodo = async (id: string) => {
  try {
    await api.delete(`/todos/${id}`);

    setTodos(todos.filter(todo => todo._id !== id));
  } catch (error: any) {
    console.log(
      'DELETE TODO ERROR:',
      error.response?.data || error.message,
    );
  }
};

  return (
    <View style={styles.container}>

    
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>

        <TouchableOpacity onPress={handleLogout}>
  <Text style={styles.logout}>Logout</Text>
</TouchableOpacity>
      </View>


      <View style={styles.inputContainer}>
    <View style={{ width: '70%', height: 120 }}>
  <TextInput
    style={{
      flex: 3,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 14,
    }}
    placeholder="Add a new todo..."
    value={todo}
    onChangeText={setTodo}
  />

  <TextInput
    style={{
      flex: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 14,
    }}
    placeholder="Description"
    value={description}
    onChangeText={setDescription}
  />
</View>


        <View > 
           <Text  style={{
    backgroundColor: 'green',
    color: 'white',
    padding: 8,
    borderRadius: 2,
    fontSize:14,
   
  }}>Priority</Text>
  <Button title="Low" onPress={() => setPriority('low')} />
  <Button title="Medium" onPress={() => setPriority('medium')} />
  <Button title="High" onPress={() => setPriority('high')} />
</View>


       <TouchableOpacity
  style={styles.addButton}
  onPress={addTodo}
  disabled={loading}
>
  <Text style={styles.addText}>
    {loading ? '...' : '+'}
  </Text>
</TouchableOpacity>
      </View>

     
     <FlatList
  data={todos}
  keyExtractor={(item) => item._id}
  renderItem={({item}) => (
   <View style={styles.todoItem}>

  <TouchableOpacity
    onPress={() => toggleTodo(item._id, item.completed)}
  >
    
    <Text>
      {item.completed ? '☑' : '☐'}
    </Text>

  </TouchableOpacity>
 <View style={{flex: 1, marginLeft: 8}}>
  <Text
    style={[
      styles.todoText,
      item.completed && styles.completedText,
    ]}
  >
    {item.title}
  </Text>

 <Text
  style={[
    styles.descriptionText,
    item.completed && styles.completedText,
  ]}
>
  {item.description}
</Text>
  <View style={{
  backgroundColor: 'green',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
  alignSelf: 'flex-start',
  marginTop: 5,
}}>
  <Text style={{
    color: 'white',
    fontSize: 12,
  }}>
    {item.priority}
  </Text>
</View>
</View>
<TouchableOpacity
  onPress={() => {
    console.log('EDIT CLICKED');
    setEditingTodo(item);
    setTodo(item.title);
    setDescription(item.description || '');
    setPriority(item.priority || 'low');
  }}
>
  <Text style={{color: 'blue', padding: 10}}>EDIT</Text>
</TouchableOpacity>

  <TouchableOpacity onPress={() => deleteTodo(item._id)}>
    <Text style={styles.deleteText}>Delete</Text>
  </TouchableOpacity>

</View>
  )}
  ListEmptyComponent={
    <Text style={styles.emptyText}>
      No todos yet
    </Text>
  }
/>

    </View>
  );
};

const styles = StyleSheet.create({
editButton: {
  paddingHorizontal: 8,
  paddingVertical: 5,
  marginLeft: 8,
},

editText: {
  color: 'white',
  fontSize: 12,
  fontWeight: '600',
},
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
     color:  '#4a1dd1',
    fontSize: 28,
    fontWeight: 'bold',
  },
  descriptionText: {
  fontSize: 13,
  color: '#666',
  marginTop: 3,
},

  logout: {
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  addButton: {
    width: 50,
    marginLeft: 3,
    backgroundColor:  '#4a1dd1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    color: '#fff',
    fontSize: 28,
  },

todoItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  backgroundColor: '#fff',
}
,
  todoText: {
  flex: 1,
  fontSize: 15,
  marginLeft: 8,
},

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
deleteText: {
  color: 'red',
  fontWeight: '600',
  marginLeft: 8,
},
completedText: {
  textDecorationLine: 'line-through',
  opacity: 0.5,
  
},

});



export default TodoScreen;

