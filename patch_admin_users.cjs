const fs = require('fs');

const path = 'src/pages/admin/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
content = content.replace(
  "import { useToast } from '../../context/ToastContext';",
  "import { useToast } from '../../context/ToastContext';\nimport { AdminUserDetails } from './AdminUserDetails';"
);

// Add selectedUser state
content = content.replace(
  "const { success, error } = useToast();",
  "const { success, error } = useToast();\n  const [selectedUser, setSelectedUser] = useState<any>(null);"
);

// Add action button for view
const editButtonHtml = `
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors inline-flex"
                    title="View Details"
                  >
                    <Edit2 size={16} />
                  </button>`;

content = content.replace(
  '<td className="px-8 py-5 text-right space-x-2">',
  '<td className="px-8 py-5 text-right space-x-2">' + editButtonHtml
);

// Add modal 
const modalHtml = `
      {selectedUser && (
        <AdminUserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
`;
content = content.replace(
  "    </div>\n  );\n}",
  modalHtml
);

fs.writeFileSync(path, content, 'utf8');
