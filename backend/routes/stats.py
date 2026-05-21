from fastapi import APIRouter, HTTPException
from services import db_service
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/api', tags=['stats'])


@router.get('/stats')
async def get_stats():
    """
    Returns aggregate statistics from the predictions table.
    """
    try:
        client = db_service.get_client()

        res = client.table('predictions').select('*').execute()
        rows = res.data or []

        total = len(rows)
        fake_count = sum(1 for r in rows if r.get('prediction') == 'FAKE')
        real_count = sum(1 for r in rows if r.get('prediction') == 'REAL')

        confidences = [r.get('confidence', 0) for r in rows if r.get('confidence') is not None]
        peak_confidence = max(confidences) if confidences else 0.0
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        # Daily counts for the last 7 days
        now = datetime.now(timezone.utc)
        daily_counts = []
        for i in range(7):
            day = (now - timedelta(days=6 - i)).date()
            day_str = day.isoformat()
            count_fake = 0
            count_real = 0
            for r in rows:
                created = r.get('created_at')
                if created:
                    try:
                        if isinstance(created, str):
                            created_dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
                        else:
                            created_dt = created
                        if created_dt.date() == day:
                            if r.get('prediction') == 'FAKE':
                                count_fake += 1
                            elif r.get('prediction') == 'REAL':
                                count_real += 1
                    except Exception:
                        continue
            daily_counts.append({
                'date': day_str,
                'day_name': day.strftime('%a').upper(),
                'fake': count_fake,
                'real': count_real,
                'total': count_fake + count_real,
            })

        # Model distribution
        model_counts = {}
        for r in rows:
            model = r.get('model_used', 'unknown')
            model_counts[model] = model_counts.get(model, 0) + 1

        return {
            'total': total,
            'fake_count': fake_count,
            'real_count': real_count,
            'peak_confidence': round(peak_confidence, 4),
            'avg_confidence': round(avg_confidence, 4),
            'training_accuracy': 0.984,
            'daily_counts': daily_counts,
            'model_counts': model_counts,
        }
    except Exception as e:
        logger.error(f"Failed to compute stats: {e}")
        raise HTTPException(status_code=500, detail=f"Stats computation failed: {str(e)}")
