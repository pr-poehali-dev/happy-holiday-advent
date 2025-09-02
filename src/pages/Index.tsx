import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  category: 'drawing' | 'craft' | 'decoration';
}

interface Gift {
  id: number;
  name: string;
  price: number;
  emoji: string;
  purchased: boolean;
}

interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  totalSnowflakes: number;
  tasksCompleted: number;
  giftsOwned: number;
  streak: number;
  achievements: string[];
}

const AdventCalendar = () => {
  const [snowflakes, setSnowflakes] = useState(120);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [openedDays, setOpenedDays] = useState<number[]>([1, 2, 3]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Маша',
    avatar: 'img/b663e2d7-0b4d-4d92-8310-90a2c8402993.jpg',
    level: 3,
    totalSnowflakes: 285,
    tasksCompleted: 8,
    giftsOwned: 2,
    streak: 5,
    achievements: ['🎨 Первый рисунок', '✂️ Мастер поделок', '🎄 Украшатель']
  });
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Нарисуй снеговика", description: "Используй цветные карандаши или краски, чтобы нарисовать весёлого снеговика с морковкой-носом!", reward: 15, completed: false, category: 'drawing' },
    { id: 2, title: "Сделай снежинку из бумаги", description: "Сложи белую бумагу и вырежи красивую снежинку. Каждая снежинка уникальна!", reward: 20, completed: false, category: 'craft' },
    { id: 3, title: "Укрась окно", description: "Приклей бумажные снежинки или нарисуй морозные узоры на окне зубной пастой", reward: 25, completed: true, category: 'decoration' },
    { id: 4, title: "Слепи из пластилина ёлочку", description: "Используй зелёный пластилин для ёлки и разноцветный для игрушек", reward: 18, completed: false, category: 'craft' },
    { id: 5, title: "Нарисуй новогоднюю открытку", description: "Создай красивую открытку для мамы и папы с новогодними пожеланиями", reward: 22, completed: false, category: 'drawing' }
  ]);
  const [gifts, setGifts] = useState<Gift[]>([
    { id: 1, name: "Золотая звезда", price: 50, emoji: "⭐", purchased: false },
    { id: 2, name: "Волшебная палочка", price: 80, emoji: "🪄", purchased: false },
    { id: 3, name: "Новогодний венок", price: 35, emoji: "🎄", purchased: false },
    { id: 4, name: "Подарочная коробка", price: 45, emoji: "🎁", purchased: false },
    { id: 5, name: "Праздничный колокольчик", price: 25, emoji: "🔔", purchased: false },
    { id: 6, name: "Снежный шар", price: 60, emoji: "🔮", purchased: false }
  ]);



  const getCurrentDate = () => new Date().getDate();
  const today = getCurrentDate();

  const openDay = (day: number) => {
    if (day <= today && !openedDays.includes(day)) {
      setOpenedDays([...openedDays, day]);
      setSnowflakes(prev => prev + 10);
      setProfile(prev => ({...prev, totalSnowflakes: prev.totalSnowflakes + 10}));
    }
    setSelectedDay(day);
  };

  const updateProfile = () => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const purchasedGifts = gifts.filter(g => g.purchased).length;
    setProfile(prev => ({
      ...prev,
      tasksCompleted: completedTasks,
      giftsOwned: purchasedGifts
    }));
  };

  const completeTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        setSnowflakes(prev => prev + task.reward);
        setProfile(prev => ({...prev, totalSnowflakes: prev.totalSnowflakes + task.reward}));
        return { ...task, completed: true };
      }
      return task;
    });
    setTasks(updatedTasks);
    setSelectedTask(null);
    updateProfile();
  };

  const buyGift = (giftId: number) => {
    const updatedGifts = gifts.map(gift => {
      if (gift.id === giftId && !gift.purchased && snowflakes >= gift.price) {
        setSnowflakes(prev => prev - gift.price);
        return { ...gift, purchased: true };
      }
      return gift;
    });
    setGifts(updatedGifts);
    updateProfile();
  };

  const renderCalendarDay = (day: number) => {
    const isToday = day === today;
    const isOpened = openedDays.includes(day);
    const isPast = day < today;
    const isFuture = day > today;

    return (
      <div
        key={day}
        onClick={() => !isFuture && openDay(day)}
        className={`
          relative w-16 h-16 md:w-20 md:h-20 rounded-xl cursor-pointer transition-all duration-300
          ${isToday ? 'ring-4 ring-christmas-gold animate-bounce-gentle' : ''}
          ${isOpened ? 'bg-christmas-green text-white' : 'bg-white border-2 border-christmas-red'}
          ${isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${isPast && !isOpened ? 'bg-gray-100' : ''}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{day}</span>
        </div>
        {isOpened && (
          <div className="absolute -top-2 -right-2">
            <Icon name="Gift" size={16} className="text-christmas-gold" />
          </div>
        )}
        {isToday && !isOpened && (
          <div className="absolute -top-1 -right-1 animate-pulse">
            ✨
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-christmas-red mb-4 animate-fade-in">
            🎄 Новогодний Адвент-Календарь 🎄
          </h1>
          <div className="flex items-center justify-center gap-4 text-xl">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="text-2xl">❄️</span>
              <span className="font-semibold text-christmas-blue">{snowflakes} снежинок</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => {setShowShop(false); setShowProfile(false);}}
            className={`rounded-full px-6 py-2 ${!showShop && !showProfile ? 'bg-christmas-red hover:bg-red-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            <Icon name="Calendar" size={20} />
            Календарь
          </Button>
          <Button
            onClick={() => {setShowShop(true); setShowProfile(false);}}
            className={`rounded-full px-6 py-2 ${showShop ? 'bg-christmas-green hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            <Icon name="Store" size={20} />
            Магазин подарков
          </Button>
          <Button
            onClick={() => {setShowProfile(true); setShowShop(false);}}
            className={`rounded-full px-6 py-2 ${showProfile ? 'bg-christmas-blue hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            <Icon name="User" size={20} />
            Профиль
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {showProfile ? (
          /* Profile Section */
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img 
                      src={profile.avatar} 
                      alt="Аватар" 
                      className="w-24 h-24 rounded-full border-4 border-christmas-gold shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-christmas-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {profile.level}
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-bold text-christmas-red mb-2">Привет, {profile.name}! 👋</h2>
                    <p className="text-gray-600 mb-4">Уровень {profile.level} • Творческий мастер</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-blue-50 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold text-christmas-blue">{profile.totalSnowflakes}</div>
                        <div className="text-sm text-gray-600">❄️ Снежинок собрано</div>
                      </div>
                      <div className="bg-green-50 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold text-christmas-green">{profile.tasksCompleted}</div>
                        <div className="text-sm text-gray-600">📝 Заданий выполнено</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold text-christmas-gold">{profile.streak}</div>
                        <div className="text-sm text-gray-600">🔥 Дней подряд</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress & Achievements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-christmas-green">
                    <Icon name="TrendingUp" size={24} />
                    Прогресс
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">До следующего уровня</span>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-christmas-blue h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Творческие задания</span>
                        <span className="text-sm text-gray-600">8/15</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-christmas-green h-2 rounded-full" style={{width: '53%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Дни календаря</span>
                        <span className="text-sm text-gray-600">3/25</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-christmas-red h-2 rounded-full" style={{width: '12%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-christmas-gold">
                    <Icon name="Award" size={24} />
                    Достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="text-2xl">
                          {achievement.split(' ')[0]}
                        </div>
                        <div className="font-medium text-gray-700">
                          {achievement.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg opacity-50">
                      <div className="text-2xl">🏆</div>
                      <div className="font-medium text-gray-500">Мастер календаря</div>
                      <div className="text-xs text-gray-400 ml-auto">Скоро...</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-christmas-red">
                  <Icon name="BarChart3" size={24} />
                  Статистика активности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="text-2xl font-bold text-pink-600">5</div>
                    <div className="text-sm text-gray-600">Рисунков</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">✂️</div>
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Поделок</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">🎀</div>
                    <div className="text-2xl font-bold text-purple-600">2</div>
                    <div className="text-sm text-gray-600">Украшений</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">🎁</div>
                    <div className="text-2xl font-bold text-green-600">{profile.giftsOwned}</div>
                    <div className="text-sm text-gray-600">Подарков</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !showShop ? (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-5 md:grid-cols-7 gap-4 mb-8 place-items-center">
              {Array.from({ length: 25 }, (_, i) => renderCalendarDay(i + 1))}
            </div>

            {/* Today's Tasks */}
            <Card className="mb-8 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-christmas-green">
                  <Icon name="CheckSquare" size={24} />
                  Творческие задания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105
                        ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-christmas-red hover:border-christmas-gold'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge className={`
                          ${task.category === 'drawing' ? 'bg-pink-100 text-pink-700' : ''}
                          ${task.category === 'craft' ? 'bg-blue-100 text-blue-700' : ''}
                          ${task.category === 'decoration' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                          {task.category === 'drawing' ? '🎨 Рисование' : ''}
                          {task.category === 'craft' ? '✂️ Поделка' : ''}
                          {task.category === 'decoration' ? '🎀 Украшение' : ''}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-christmas-blue font-semibold">
                          <span>❄️</span>
                          <span>+{task.reward}</span>
                        </div>
                        {task.completed && (
                          <Icon name="CheckCircle" size={20} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Gift Shop */
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-christmas-green">
                <Icon name="Store" size={24} />
                Магазин новогодних подарков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className={`
                      p-6 rounded-xl border-2 text-center transition-all duration-300
                      ${gift.purchased ? 'bg-green-50 border-green-200 opacity-75' : 'bg-white border-christmas-gold hover:scale-105 hover:shadow-lg'}
                    `}
                  >
                    <div className="text-6xl mb-4">{gift.emoji}</div>
                    <h3 className="font-semibold text-lg mb-2">{gift.name}</h3>
                    <div className="flex items-center justify-center gap-1 mb-4 text-christmas-blue font-semibold">
                      <span>❄️</span>
                      <span>{gift.price}</span>
                    </div>
                    <Button
                      onClick={() => buyGift(gift.id)}
                      disabled={gift.purchased || snowflakes < gift.price}
                      className={`w-full ${
                        gift.purchased 
                          ? 'bg-green-500 hover:bg-green-500 cursor-default' 
                          : snowflakes >= gift.price 
                            ? 'bg-christmas-red hover:bg-red-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {gift.purchased ? (
                        <>
                          <Icon name="CheckCircle" size={16} />
                          Куплено!
                        </>
                      ) : snowflakes >= gift.price ? (
                        'Купить'
                      ) : (
                        'Недостаточно снежинок'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={selectedTask !== null} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">
                {selectedTask?.category === 'drawing' ? '🎨' : ''}
                {selectedTask?.category === 'craft' ? '✂️' : ''}
                {selectedTask?.category === 'decoration' ? '🎀' : ''}
              </span>
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedTask?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2 text-christmas-blue font-semibold text-lg">
              <span>❄️</span>
              <span>+{selectedTask?.reward} снежинок</span>
            </div>
            <Button
              onClick={() => selectedTask && completeTask(selectedTask.id)}
              disabled={selectedTask?.completed}
              className="bg-christmas-green hover:bg-green-700"
            >
              {selectedTask?.completed ? 'Выполнено!' : 'Выполнить задание'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating snowflakes decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-70 animate-bounce-gentle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❄️
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventCalendar;