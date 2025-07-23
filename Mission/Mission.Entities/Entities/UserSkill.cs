using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mission.Entities.Entities
{
    public class UserSkill
    {
        public int UserId { get; set; }
        public int SkillId { get; set; }

        public User User { get; set; }
        public MissionSkill Skill { get; set; }
    }
}
