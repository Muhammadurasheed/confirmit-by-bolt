import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface FraudStats {
  scamAccountsReported: number;
  peopleProtected: number;
  averageReviewTimeHours: number;
}

export const fraudStatsService = {
  /**
   * Fetch real-time fraud statistics from Firebase
   */
  async getFraudStats(): Promise<FraudStats> {
    try {
      // Fetch all fraud reports
      const reportsRef = collection(db, 'fraud_reports');
      const reportsSnapshot = await getDocs(reportsRef);
      
      const scamAccountsReported = reportsSnapshot.size;
      
      // Estimate people protected (10x multiplier for network effect)
      const peopleProtected = scamAccountsReported * 71;
      
      // Calculate average review time from resolved reports
      const resolvedQuery = query(
        reportsRef,
        where('status', '==', 'verified')
      );
      const resolvedSnapshot = await getDocs(resolvedQuery);
      
      let totalReviewTimeHours = 0;
      let reviewedCount = 0;
      
      resolvedSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.created_at && data.resolved_at) {
          const createdAt = data.created_at instanceof Timestamp 
            ? data.created_at.toDate() 
            : new Date(data.created_at);
          const resolvedAt = data.resolved_at instanceof Timestamp 
            ? data.resolved_at.toDate() 
            : new Date(data.resolved_at);
          
          const diffMs = resolvedAt.getTime() - createdAt.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          totalReviewTimeHours += diffHours;
          reviewedCount++;
        }
      });
      
      const averageReviewTimeHours = reviewedCount > 0 
        ? Math.round(totalReviewTimeHours / reviewedCount) 
        : 24;
      
      return {
        scamAccountsReported,
        peopleProtected,
        averageReviewTimeHours,
      };
    } catch (error) {
      console.error('Failed to fetch fraud stats:', error);
      // Return default stats on error
      return {
        scamAccountsReported: 0,
        peopleProtected: 0,
        averageReviewTimeHours: 24,
      };
    }
  },
};
