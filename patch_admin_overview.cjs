const fs = require('fs');
const path = 'src/pages/admin/AdminOverview.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add more stat cards
const replacementCards = `
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={\`₹\${stats.todayRevenue.toLocaleString()}\`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Monthly Revenue" value={\`₹\${stats.monthlyRevenue.toLocaleString()}\`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Yearly Revenue" value={\`₹\${stats.yearlyRevenue.toLocaleString()}\`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Payments" value={stats.payments} icon={DollarSign} color="text-indigo-600" bg="bg-indigo-50" />
        
        <StatCard title="Active Customers" value={stats.activeCustomers} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="New Customers" value={stats.newCustomers} icon={UserPlus} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Website Visitors" value={stats.websiteVisitors} icon={Users} color="text-slate-600" bg="bg-slate-50" />
        <StatCard title="Refunds" value={stats.refunds} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
      </div>
`;

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">[\s\S]*?<\/div>/,
  replacementCards
);

// Add missing operations rows
const replacementOps = `
          <div className="space-y-4 flex-1">
            <OpRow label="Pending Orders" value={stats.pendingOrders} icon={Activity} color="text-amber-500" />
            <OpRow label="Completed Orders" value={stats.completedOrders} icon={Target} color="text-emerald-500" />
            <OpRow label="Pending Research" value={stats.pendingResearch} icon={FileText} color="text-purple-500" />
            <OpRow label="Completed Research" value={stats.completedResearch} icon={FileText} color="text-emerald-500" />
            <OpRow label="Launch Projects" value={stats.businessProjects} icon={Briefcase} color="text-blue-500" />
            <OpRow label="Support Tickets" value={stats.supportTickets} icon={AlertCircle} color="text-rose-500" />
            <OpRow label="Career Apps" value={stats.careerApps} icon={Zap} color="text-indigo-500" />
          </div>
`;

content = content.replace(
  /<div className="space-y-4 flex-1">[\s\S]*?<\/div>/,
  replacementOps
);

fs.writeFileSync(path, content, 'utf8');
