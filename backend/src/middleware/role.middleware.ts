import { Router } from 'express'
import { protect, authorize } from '../middleware/auth.middleware'
import { UserRole } from '../types'
import Vehicle from '../models/Vehicle.model'
import { Request, Response } from 'express'

const router = Router()

router.use(protect, authorize(UserRole.DRIVER))

// GET /api/driver/vehicle — get own vehicle
router.get('/vehicle', async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findOne({ driver: req.user?.userId })
    res.json({ vehicle })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
