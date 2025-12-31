// ========================================
// Skill Tree Page
// Wrapper for Skill Tree visualization
// ========================================

import SkillTree from '../components/SkillTree'

function SkillTreePage() {
  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Your Skill Tree</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Master concepts in order. Each skill unlocks the next level.
        </p>
      </div>
      
      <SkillTree />
    </div>
  )
}

export default SkillTreePage
