import { Briefcase, Building2, Clock, Code2, Contact, OrigamiIcon, UserCheck, Zap } from 'lucide-react';
import React from 'react'
import Title from './Title';

const Features = () => {

  const [isHover, setIsHover] = React.useState(false);

  return (
    <div id='features' className='flex flex-col items-center my-10 scroll-mt-12'>
      <div className="flex items-center gap-2 text-sm text-purple-800 bg-purple-400/10 rounded-full px-6 py-1.5">
        <Zap width={14} />
        <span>Smart Practice</span>
      </div>

      <Title title='Master your interview skills' description='Our AI-powered platform helps you practice and perfect your interview skills with realistic mock interviews, instant feedback, and personalized improvement tips.' />

      <div className="flex flex-col md:flex-row items-center xl:-mt-10">
        <img className="max-w-2xl w-full xl:-ml-32" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="" />
        
        <div className="px-4 md:px-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
          <div className={"flex items-center justify-center gap-6 max-w-md group cursor-pointer"}>
            <div className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300  flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
              <Building2 className='size-5 mt-1' />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Industry-Specific Questions</h3>
                <p className="text-sm text-slate-600 max-w-xs">Practice with curated questions tailored to your target role and industry.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
              <Clock className='size-5 mt-1' />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Real-Time Feedback</h3>
                <p className="text-sm text-slate-600 max-w-xs">Get instant insights into your performance with AI-powered analysis and scoring.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
              <UserCheck className='size-5 mt-1' />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Personalized Coaching</h3>
                <p className="text-sm text-slate-600 max-w-xs">Receive customized improvement tips and track your progress over time.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 group-hover:bg-blue-100 border border-transparent group-hover:border-blue-300 flex gap-4 rounded-xl transition-colors">
              <Code2 className='size-5 mt-1' />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">DSA Preparation</h3>
                <p className="text-sm text-slate-600 max-w-xs">Solve handpicked DSA problems designed to prepare you for technical interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
    </div>

  )
}

export default Features