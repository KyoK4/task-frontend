let tasks = [];

const addTask = async (title, priority) => {
  try {
    await fetch('https://task-backend-tn1o.onrender.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ title: title, priority: priority }) 
    });
    
    fetchTasks();
  } catch (error) {
    console.error("เพิ่มงานไม่สำเร็จ:", error);
  }
};


const toggleTaskStatus = async (id) => {
  try {
    await fetch(`https://task-backend-tn1o.onrender.com/tasks/${id}`, {
      method: 'PUT'
    });
    fetchTasks(); // ดึงข้อมูลใหม่
  } catch (error) {
    console.error("เปลี่ยนสถานะไม่สำเร็จ:", error);
  }
};


const deleteTask = async (id) => {
  try {
    await fetch(`https://task-backend-tn1o.onrender.com/tasks/${id}`, {
      method: 'DELETE'
    });
    fetchTasks(); 
  } catch (error) {
    console.error("ลบงานไม่สำเร็จ:", error);
  }
};

const taskListElement = document.querySelector('#taskList');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const priorityInput = document.querySelector('#priorityInput');


const fetchTasks = async () => {
  try {
    taskListElement.innerHTML = "<h3 style='text-align: center;'> กำลังดึงข้อมูลจากเซิร์ฟเวอร์...</h3>";
    
    const response = await fetch('https://task-backend-tn1o.onrender.com/tasks');
    const data = await response.json();
    
    tasks = data.map(item => {
      return {
        id: item._id, // แก้เป็น _id ตามฐานข้อมูล MongoDB[cite: 2]
        title: item.title,
        completed: item.completed,
        priority: item.priority || "low" // กำหนดค่าเริ่มต้นถ้าไม่มี[cite: 2]
      };
    });
    
    renderTasks();
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    taskListElement.innerHTML = "<h3 style='text-align: center; color: red;'> ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่</h3>";
  }
};

const renderTasks = () => {
  if (tasks.length === 0) {
    taskListElement.innerHTML = "<p> เยี่ยมมาก! ไม่มีงานค้างเลย</p>";
    return;
  }

  const htmlString = tasks.map(task => {
    const textStyle = task.completed ? "text-decoration: line-through; color: gray;" : "";
    
    return `
      <div class="task-card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- ข้อ 10: เพิ่ม Single Quote (') ครอบ ${task.id} เพื่อป้องกัน Error จาก _id ของ MongoDB -->
          <input type="checkbox" onchange="handleToggle('${task.id}')" ${task.completed ? 'checked' : ''}>
          <span style="${textStyle}">${task.title} <small>(${task.priority})</small></span>
        </div>
        <button onclick="handleDelete('${task.id}')" style="color: red; cursor: pointer;">ลบ</button>
      </div>
    `;
  }).join(''); 

  taskListElement.innerHTML = htmlString;
};

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTitle = taskInput.value;
  const newPriority = priorityInput.value;

  addTask(newTitle, newPriority);
  
  taskInput.value = '';
});

const handleDelete = (id) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) {
    deleteTask(id);
    
  }
};

const handleToggle = (id) => {
  toggleTaskStatus(id);
  
};


fetchTasks();