import { Music, Users, Cake, GraduationCap, Plane  } from "lucide-react";


const Features = () => {
  const featureContent = [
    {
      type: "Music Events",
      desc: "Plan and manage concerts, festivals, and music shows effortlessly.",
      icon: <Music className='w-8 h-8 mx-auto mb-4'/>
    },
    {
      type: "Corporate Meetings",
      desc: "Organize corporate meetings, seminars, and business conferences.",
      icon: <Users className='w-8 h-8 mx-auto mb-4'/>
    },
    {
      type: "Private Parties",
      desc: "Effortlessly plan weddings, birthdays, and private celebrations.",
      icon: <Cake className='w-8 h-8 mx-auto mb-4'/>
    },
    {
    type: "Academic Events",
    desc: "Coordinate graduation ceremonies, workshops, and student expos with ease.",
    icon: <GraduationCap className="w-8 h-8 mx-auto mb-4" />,
  },
  {
    type: "Travel & Tours",
    desc: "Manage group travel, tours, and destination experiences efficiently.",
    icon: <Plane className="w-8 h-8 mx-auto mb-4" />,
  },
  ]

  return (
    <div className="px-6 py-16 bg-gray-200 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold sm:text-3xl">Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            {featureContent.map((item, index) => (
              <div className="p-8 text-center bg-gray-300 rounded-lg dark:bg-gray-700">
                {item.icon}
                <h3 className="mb-2 font-semibold">{item.type}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-100">
                  {item.desc}
                </p>                
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Features