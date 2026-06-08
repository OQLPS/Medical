import { Users, Activity, Calendar, FileText } from 'lucide-react';

export default function DashboardStats({ patientsCount, doctorsCount, appointmentsCount, recordsCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">Всего пациентов</p>
          <h3 className="text-2xl font-black mt-1 text-slate-100">{patientsCount}</h3>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Users size={20} />
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">Врачей в штате</p>
          <h3 className="text-2xl font-black mt-1 text-slate-100">{doctorsCount}</h3>
        </div>
        <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
          <Activity size={20} />
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">Активных записей</p>
          <h3 className="text-2xl font-black mt-1 text-slate-100">{appointmentsCount}</h3>
        </div>
        <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Calendar size={20} />
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">Медицинских карт</p>
          <h3 className="text-2xl font-black mt-1 text-slate-100">{recordsCount}</h3>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
          <FileText size={20} />
        </div>
      </div>
    </div>
  );
}