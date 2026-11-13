export interface Service {
  id: number
  title: string
  description: string
  category: string
  price: string | number
  delivery_days: number
  freelancer?: number
  freelancer_name?: string
  created_at?: string
}

export interface Proposal {
  id: number
  project?: number
  project_title?: string
  freelancer?: number
  freelancer_name?: string
  bid_amount: string | number
  delivery_days: number
  cover_letter: string
  status: string
  created_at?: string
}

export interface Project {
  id: number
  title: string
  description: string
  budget: string | number
  deadline: string
  status: string
  client?: number
  client_name?: string
  proposals?: Proposal[]
  created_at?: string
}

export interface Order {
  id: number
  client?: number
  client_name?: string
  freelancer?: number
  freelancer_name?: string
  amount: string | number
  status: string
  delivery_file?: string | null
  delivered_at?: string | null
  created_at?: string
  review_exists?: boolean
}

export interface Review {
  id: number
  client_name?: string
  freelancer_name?: string
  rating: number
  comment: string
  created_at?: string
}

export interface Freelancer {
  id: number
  username: string
  email?: string
  bio?: string
  profile_picture?: string | null
  services_count?: number
  completed_orders?: number
  average_rating?: number | null
  reviews_count?: number
  services?: Service[]
}

export interface NotificationItem {
  id: number
  message: string
  is_read: boolean
  created_at?: string
}

export interface WalletSummary {
  available_balance?: number
  total_earned?: number
  pending_withdrawals?: number
  total_withdrawn?: number
  total_spent?: number
}

export interface Transaction {
  id: number
  type: string
  amount: string | number
  note?: string
  created_at?: string
}

export interface Withdrawal {
  id: number
  username?: string
  amount: string | number
  method: string
  account_details?: string
  status: string
  created_at?: string
}
