import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wrench, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Schedule = () => {
    const { vehicles } = useVehicles();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    // 1. Get all services flattened
    const allServices = vehicles.flatMap(vehicle =>
        (vehicle.services || []).map(service => ({
            ...service,
            vehicleName: vehicle.name,
            vehicleId: vehicle.id
        }))
    );

    // 2. Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // 3. Navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // 4. Get services for a specific day
    const getServicesForDay = (day) => {
        return allServices.filter(service => isSameDay(parseISO(service.date), day));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-cod-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-neon-green/10 p-2 rounded-sm border border-neon-green/20">
                        <CalendarIcon className="text-neon-green" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-cod-text tracking-wider">CALENDARIO TÁCTICO</h1>
                        <p className="text-xs text-cod-text-dim uppercase tracking-[0.2em]">Programación de Operaciones</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-cod-panel border border-cod-border rounded-sm p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-cod-dark hover:text-neon-green text-cod-text transition-colors rounded-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-mono font-bold text-lg w-40 text-center uppercase tracking-widest">
                        {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-cod-dark hover:text-neon-green text-cod-text transition-colors rounded-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-cod-panel border border-cod-border rounded-sm p-4 shadow-lg">
                    {/* Week Header */}
                    <div className="grid grid-cols-7 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-bold text-cod-text-dim uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                            const dayServices = getServicesForDay(day);
                            const hasServices = dayServices.length > 0;
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isTodayDate = isToday(day);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => hasServices && setSelectedDay({ date: day, services: dayServices })}
                                    className={`
                                        min-h-[80px] p-2 border rounded-sm relative transition-all cursor-pointer group
                                        ${isCurrentMonth ? 'bg-cod-dark/50 border-cod-border/50' : 'bg-cod-darker/30 border-transparent opacity-50'}
                                        ${isTodayDate ? 'border-neon-green shadow-[0_0_10px_rgba(0,255,136,0.1)]' : ''}
                                        ${hasServices ? 'hover:bg-cod-dark hover:border-cod-text-dim' : ''}
                                    `}
                                >
                                    <span className={`text-xs font-mono ${isTodayDate ? 'text-neon-green font-bold' : 'text-cod-text-dim'}`}>
                                        {format(day, 'd')}
                                    </span>

                                    {/* Service Indicators */}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {dayServices.map((svc, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${svc.status === 'completed' ? 'bg-neon-green shadow-[0_0_5px_rgba(0,255,136,0.5)]' : 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]'}`}
                                                title={`${svc.vehicleName} - ${svc.type}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details Panel (Side) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-cod-panel border border-cod-border rounded-sm p-1 h-full">
                        <div className="bg-cod-dark/50 p-4 border-b border-cod-border flex items-center gap-2">
                            <Wrench size={16} className="text-neon-green" />
                            <h2 className="font-bold text-cod-text tracking-wider text-sm uppercase">
                                {selectedDay ? `Operaciones: ${format(selectedDay.date, 'd MMM', { locale: es })}` : 'Detalle de Operaciones'}
                            </h2>
                        </div>

                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-cod">
                            {selectedDay ? (
                                selectedDay.services.map((service, idx) => (
                                    <div key={idx} className="bg-cod-dark border border-cod-border rounded-sm p-3 hover:border-neon-green/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-cod-text text-sm">{service.vehicleName}</h3>
                                            {service.status === 'completed' ? (
                                                <CheckCircle2 size={14} className="text-neon-green" />
                                            ) : (
                                                <Clock size={14} className="text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="text-xs text-cod-text-dim space-y-1">
                                            <p className="flex justify-between">
                                                <span>Tipo:</span>
                                                <span className="text-cod-text">{service.type}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Costo:</span>
                                                <span className="font-mono text-cod-text">{formatCurrency(service.cost)}</span>
                                            </p>
                                            {service.notes && (
                                                <p className="italic opacity-70 mt-2 border-t border-cod-border/30 pt-1">"{service.notes}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-cod-text-dim opacity-50">
                                    <CalendarIcon size={48} className="mb-4" />
                                    <p className="text-center text-xs uppercase tracking-widest">Selecciona un día con operaciones<br />para ver detalles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
