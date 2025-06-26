import { Music, Users, Cake, GraduationCap, Plane, HeartHandshake, Briefcase, Globe } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const featureContent = [
  {
    type: "Music Events",
    desc: "Plan and manage concerts, festivals, and music shows effortlessly.",
    icon: <Music className="w-8 h-8 mx-auto mb-4" />,
  },
  {
    type: "Corporate Meetings",
    desc: "Organize corporate meetings, seminars, and business conferences.",
    icon: <Users className="w-8 h-8 mx-auto mb-4" />,
  },
  {
    type: "Private Parties",
    desc: "Effortlessly plan weddings, birthdays, and private celebrations.",
    icon: <Cake className="w-8 h-8 mx-auto mb-4" />,
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
  {
    type: "Charity Events",
    desc: "Plan fundraising campaigns, drives, and NGO missions effectively.",
    icon: <HeartHandshake className="w-8 h-8 mx-auto mb-4" />,
  },
  {
    type: "Product Launches",
    desc: "Seamlessly manage product demos, media invites, and press coverage.",
    icon: <Briefcase className="w-8 h-8 mx-auto mb-4" />,
  },
  {
    type: "International Summits",
    desc: "Host global conventions and diplomatic events with ease.",
    icon: <Globe className="w-8 h-8 mx-auto mb-4" />,
  },
];

// Duplicate the list to enable seamless loop
const scrollingContent = [...featureContent, ...featureContent];

const Features = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ["0%", "-20%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: 40, // slow speed
        },
      },
    });
  }, [controls]);

  return (
    <div className="sm:px-2 py-16 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="">
        <h2 className="pl-3 mb-12 text-2xl font-bold sm:text-3xl">Features</h2>

        {/* Desktop carousel */}
        <div className="block overflow-hidden">
          <motion.div
            className="flex w-max gap-8"
            animate={controls}
          >
            {scrollingContent.map((item, index) => (
              <div
                key={index}
                className="w-[350px] sm:w-[400px]  px-6 py-8 rounded-xl text-center bg-gray-300 dark:bg-gray-700 shadow-md"
              >
                {item.icon}
                <h3 className="mb-2 font-semibold">{item.type}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-100">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
       
      </div>
    </div>
  );
};

export default Features;
