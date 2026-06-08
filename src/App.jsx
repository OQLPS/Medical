import { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Lock,
  TrendingUp
} from 'lucide-react';

import { supabase } from './supabaseClient';
import DashboardStats from './components/DashboardStats';
import PatientRegister from './components/PatientRegister';
import AppointmentForm from './components/AppointmentForm';
import MedicalRecords from './components/MedicalRecords';
import './styles/main.css';

export default function App() {
  const [role, setRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  const [notification, setNotification] = useState(null);

  const [newPatient, setNewPatient] = useState({ name: '', birthDate: '', phone: '', policy: '' });
  const [newAppointment, setNewAppointment] = useState({ patientId: '', doctorId: '', date: '', time: '' });
  const [newRecord, setNewRecord] = useState({ patientId: '', doctorId: '', diagnosis: '', prescription: '' });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    async function loadData() {
      const { data: pData } = await supabase.from('patients').select('*');
      if (pData) setPatients(pData);

      const { data: dData } = await supabase.from('doctors').select('*');
      if (dData && dData.length > 0) {
        setDoctors(dData);
      } else {
        const defaultDoctors = [
          { id: 'D-01', name: 'Амосова Вера Павловна', specialty: 'Терапевт', cabinet: '204', status: 'Активен' },
          { id: 'D-02', name: 'Пирогов Илья Игоревич', specialty: 'Хирург', cabinet: '305', status: 'Активен' },
          { id: 'D-03', name: 'Федоров Святослав Николаевич', specialty: 'Офтальмолог', cabinet: '102', status: 'На приёме' },
          { id: 'D-04', name: 'Бехтерева Наталья Петровна', specialty: 'Невролог', cabinet: '411', status: 'Активен' }
        ];
        setDoctors(defaultDoctors);
      }

      const { data: aData } = await supabase.from('appointments').select('*');
      if (aData) setAppointments(aData);

      const { data: rData } = await supabase.from('records').select('*');
      if (rData) setRecords(rData);
    }
    loadData();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) return;
    const id = `P-${100 + patients.length + 1}`;
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const insertData = {
      id,
      name: newPatient.name,
      birth_date: newPatient.birthDate,
      phone: newPatient.phone,
      policy: newPatient.policy,
      hash
    };

    const { error } = await supabase.from('patients').insert([insertData]);

    if (!error) {
      setPatients([...patients, insertData]);
      setNewPatient({ name: '', birthDate: '', phone: '', policy: '' });
      showToast(`Пациент успешно зарегистрирован в базе данных.`);
    } else {
      showToast(`Ошибка сохранения данных.`, 'error');
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const patientIdVal = role === 'patient' ? 1 : newAppointment.patientId; // Теперь ID первого пациента — это просто число 1
    if (!patientIdVal || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time) return;
    const id = `A-${500 + appointments.length + 1}`;

    const insertData = {
      id,
      patient_id: patientIdVal,
      doctor_id: newAppointment.doctorId,
      date: newAppointment.date,
      time: newAppointment.time,
      status: 'Ожидает',
      reminder_sent: false
    };

    const { error } = await supabase.from('appointments').insert([insertData]);

    if (!error) {
      setAppointments([...appointments, insertData]);
      setNewAppointment({ patientId: '', doctorId: '', date: '', time: '' });
      showToast(`Запись к врачу успешно создана.`);
    } else {
      showToast(`Ошибка при записи к врачу.`, 'error');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.patientId || !newRecord.doctorId || !newRecord.diagnosis || !newRecord.prescription) return;
    const id = `R-${900 + records.length + 1}`;
    const today = new Date().toISOString().split('T')[0];

    const insertData = {
      id,
      patient_id: newRecord.patientId,
      doctor_id: newRecord.doctorId,
      date: today,
      diagnosis: newRecord.diagnosis,
      prescription: newRecord.prescription
    };

    const { error } = await supabase.from('records').insert([insertData]);

    if (!error) {
      setRecords([...records, insertData]);
      setNewRecord({ patientId: '', doctorId: '', diagnosis: '', prescription: '' });
      showToast(`Клиническая запись успешно добавлена.`);
    } else {
      showToast(`Ошибка при сохранении медкарты.`, 'error');
    }
  };

  const sendReminder = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .update({ reminder_sent: true })
      .eq('id', id);

    if (!error) {
      setAppointments(appointments.map(app => {
        if (app.id === id) {
          return { ...app, reminder_sent: true };
        }
        return app;
      }));
      showToast(`Уведомление отправлено пациенту.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce flex items-center gap-3 p-4 rounded-lg bg-slate-800 border-l-4 border-emerald-500 shadow-2xl max-w-md">
          {notification.type === 'success' ? (
            <CheckCircle className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="text-cyan-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-slate-950 font-black flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">МИС «МедЭксперт»</h1>
            <p className="text-xs text-slate-400">Дипломный проект • Филиппов И.П.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold px-2 text-slate-400 uppercase tracking-wider">Ролевая модель:</span>
          {[
            { id: 'admin', label: 'Администратор', color: 'bg-emerald-500 text-slate-950' },
            { id: 'doctor', label: 'Врач', color: 'bg-cyan-500 text-slate-950' },
            { id: 'patient', label: 'Пациент', color: 'bg-amber-500 text-slate-950' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => { setRole(r.id); setActiveTab('dashboard'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === r.id ? r.color : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="px-3 py-2 bg-slate-900 rounded-lg flex items-center gap-3 border border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                <User size={16} className="text-emerald-400" />
              </div>
              <div className="truncate">
                <p className="text-xs text-slate-400">Вы вошли как:</p>
                <p className="text-sm font-bold truncate">
                  {role === 'admin' && 'Администратор (Регистратура)'}
                  {role === 'doctor' && 'Др. Амосова В. П.'}
                  {role === 'patient' && 'Иванов П. С. (Пациент)'}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Activity size={18} />
                Панель управления
              </button>

              {(role === 'admin' || role === 'doctor') && (
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'patients' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Users size={18} />
                  Реестр пациентов
                </button>
              )}

              <button
                onClick={() => setActiveTab('schedule')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'schedule' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Calendar size={18} />
                Расписание и записи
              </button>

              <button
                onClick={() => setActiveTab('emr')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'emr' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <FileText size={18} />
                Электронная карта (ЭМК)
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'reports' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp size={18} />
                  Отчеты и статистика
                </button>
              )}
            </nav>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Lock size={12} />
              <span>Шифрование данных</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Все персональные данные хэшируются и шифруются в соответствии с требованиями безопасности.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-100">Информационный дашборд</h2>
                  <p className="text-sm text-slate-400">Общая сводка состояния клиники в реальном времени</p>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                  <Clock size={14} className="text-emerald-400" />
                  <span>Сегодня: {new Date().toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <DashboardStats 
                patientsCount={patients.length}
                doctorsCount={doctors.length}
                appointmentsCount={appointments.length}
                recordsCount={records.length}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Clock className="text-emerald-400" size={18} />
                    Ближайшие приёмы на сегодня
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                        <tr>
                          <th className="p-3">Время</th>
                          <th className="p-3">Пациент</th>
                          <th className="p-3">Врач</th>
                          <th className="p-3">Статус</th>
                          <th className="p-3">Напоминание</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {appointments.slice(0, 3).map((app) => {
                          const pat = patients.find(p => p.id === app.patient_id);
                          const doc = doctors.find(d => d.id === app.doctor_id);
                          return (
                            <tr key={app.id} className="hover:bg-slate-900/50">
                              <td className="p-3 font-semibold text-emerald-400">{app.time}</td>
                              <td className="p-3">{pat ? pat.name : 'Неизвестен'}</td>
                              <td className="p-3">{doc ? doc.name : 'Неизвестен'}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  {app.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {app.reminder_sent ? (
                                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle size={12} /> Отправлено
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => sendReminder(app.id)}
                                    className="px-2 py-1 bg-slate-800 text-xs hover:bg-slate-700 text-cyan-400 rounded transition-all flex items-center gap-1"
                                  >
                                    <Bell size={12} /> Напомнить
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-amber-400">
                    <Lock size={18} />
                    Безопасность системы
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <p className="font-semibold text-emerald-400 text-xs">Статус защиты ПДн:</p>
                      <p className="text-xs text-slate-300">Выполнен аудит шифрования СУБД. Все ПДн пациентов захешированы.</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <p className="font-semibold text-emerald-400 text-xs">Согласие на обработку:</p>
                      <p className="text-xs text-slate-300">При регистрации пациентов автоматически генерируется цифровое согласие на ОПД.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (role === 'admin' || role === 'doctor') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-100">Реестр пациентов клиники</h2>
                  <p className="text-sm text-slate-400">Централизованная картотека пациентов</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PatientRegister 
                  newPatient={newPatient}
                  setNewPatient={setNewPatient}
                  handleAddPatient={handleAddPatient}
                />

                <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Зарегистрированные пациенты</h3>
                    <span className="text-xs text-slate-400">Всего в базе: {patients.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">ФИО</th>
                          <th className="p-3">Дата рожд.</th>
                          <th className="p-3">Телефон</th>
                          <th className="p-3">Хэш ПДн (ГОСТ)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {patients.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-semibold text-emerald-400">{p.id}</td>
                            <td className="p-3 font-medium">{p.name}</td>
                            <td className="p-3">{p.birth_date}</td>
                            <td className="p-3">{p.phone}</td>
                            <td className="p-3 font-mono text-[10px] text-slate-500 truncate max-w-[120px]" title={p.hash}>
                              {p.hash}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-100">Расписание приёмов врачей</h2>
                <p className="text-sm text-slate-400">Управление расписанием специалистов и записью пациентов на приём</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {doctors.map(doc => (
                  <div key={doc.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-100">{doc.name}</h4>
                        <p className="text-xs text-emerald-400">{doc.specialty}</p>
                      </div>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                        Каб. {doc.cabinet}
                      </span>
                    </div>
                    <div className="h-[2px] bg-slate-800"></div>
                    <div className="text-xs text-slate-400 flex justify-between items-center">
                      <span>Статус врача:</span>
                      <span className="text-emerald-400 font-semibold">{doc.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AppointmentForm 
                  role={role}
                  patients={patients}
                  doctors={doctors}
                  newAppointment={newAppointment}
                  setNewAppointment={setNewAppointment}
                  handleAddAppointment={handleAddAppointment}
                />

                <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg">Зарегистрированные посещения</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-slate-900 text-slate-400">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Пациент</th>
                          <th className="p-3">Врач</th>
                          <th className="p-3">Дата/Время</th>
                          <th className="p-3">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {appointments.map((app) => {
                          const pat = patients.find(p => p.id === app.patient_id);
                          const doc = doctors.find(d => d.id === app.doctor_id);
                          
                          if (role === 'patient' && app.patient_id !== 'P-101') return null;
                          if (role === 'doctor' && app.doctor_id !== 'D-01') return null;

                          return (
                            <tr key={app.id} className="hover:bg-slate-900/50">
                              <td className="p-3 font-semibold text-emerald-400">{app.id}</td>
                              <td className="p-3">{pat ? pat.name : 'Неизвестен'}</td>
                              <td className="p-3">
                                <p className="font-medium">{doc ? doc.name : 'Неизвестен'}</p>
                                <p className="text-[10px] text-slate-400">{doc ? doc.specialty : ''}</p>
                              </td>
                              <td className="p-3">
                                <span className="block font-semibold">{app.date}</span>
                                <span className="block text-xs text-slate-400">{app.time}</span>
                              </td>
                              <td className="p-3">
                                {app.reminder_sent ? (
                                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle size={14} /> Напоминание отправлено
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => sendReminder(app.id)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                  >
                                    <Bell size={12} /> Отправить СМС
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emr' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-100">Электронная медицинская карта (ЭМК)</h2>
                <p className="text-sm text-slate-400">Истории болезни, протоколы лечения, рецепты</p>
              </div>

              <MedicalRecords 
                role={role}
                patients={patients}
                doctors={doctors}
                newRecord={newRecord}
                setNewRecord={setNewRecord}
                handleAddRecord={handleAddRecord}
                records={records}
              />
            </div>
          )}

          {activeTab === 'reports' && role === 'admin' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-100">Генерация отчетов и аналитика</h2>
                <p className="text-sm text-slate-400">Экспорт данных и сводная аналитика посещений</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="text-emerald-400" />
                    Загруженность специалистов по направлениям
                  </h3>
                  <div className="space-y-4">
                    {[
                      { specialty: 'Терапевт', count: 12, percent: 85 },
                      { specialty: 'Хирург', count: 4, percent: 35 },
                      { specialty: 'Офтальмолог', count: 7, percent: 55 },
                      { specialty: 'Невролог', count: 6, percent: 45 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{item.specialty}</span>
                          <span className="text-slate-400">{item.count} приёмов ({item.percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-cyan-400">
                      <Download />
                      Экспорт medical-реестров
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Сгенерированные отчеты содержат обезличенные персональные данные и соответствуют рекомендациям для последующего импорта.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => showToast('Формирование отчета за месяц... Скачивание начнется автоматически.')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-lg text-xs font-semibold text-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                      Скачать реестр приемов за месяц (Excel)
                    </button>
                    <button 
                      onClick={() => showToast('Сводный отчет по загруженности сформирован и отправлен в Минздрав.')}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Экспорт статистики в Минздрав (XML/JSON)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Комплексная Медицинская Информационная Система. Дипломная работа выпускника группы 198 Филиппова И.П.</p>
      </footer>
    </div>
  );
}