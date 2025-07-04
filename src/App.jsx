import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Receiving from '@/components/pages/Receiving'
import Administration from '@/components/pages/Administration'
import Inventory from '@/components/pages/Inventory'
import Reconciliation from '@/components/pages/Reconciliation'
import Reports from '@/components/pages/Reports'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="receiving" element={<Receiving />} />
          <Route path="administration" element={<Administration />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reconciliation" element={<Reconciliation />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App