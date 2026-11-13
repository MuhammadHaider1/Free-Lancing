from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# ============================================
# Cache Keys — sab ek jagah manage karo
# ============================================

def get_services_list_key(search='', category='', page=1):
    return f"services:list:{search}:{category}:page{page}"

def get_service_detail_key(service_id):
    return f"services:detail:{service_id}"

def get_projects_list_key(search='', status='', page=1):
    return f"projects:list:{search}:{status}:page{page}"

def get_project_detail_key(project_id):
    return f"projects:detail:{project_id}"

def get_user_profile_key(user_id):
    return f"users:profile:{user_id}"

def get_reviews_list_key(freelancer_id=''):
    return f"reviews:list:{freelancer_id}"

def get_dashboard_key(user_id, role):
    return f"dashboard:{role}:{user_id}"


# ============================================
# Cache Helper Functions
# ============================================

def cache_get(key):
    """Cache se data lo"""
    try:
        data = cache.get(key)
        if data:
            logger.info(f"Cache HIT: {key}")
        else:
            logger.info(f"Cache MISS: {key}")
        return data
    except Exception as e:
        logger.error(f"Cache GET error: {e}")
        return None


def cache_set(key, data, timeout=None):
    """Cache mein data save karo"""
    try:
        if timeout is None:
            timeout = settings.CACHE_TTL.get('SERVICES_LIST', 300)
        cache.set(key, data, timeout=timeout)
        logger.info(f"Cache SET: {key} (timeout={timeout}s)")
    except Exception as e:
        logger.error(f"Cache SET error: {e}")


def cache_delete(key):
    """Cache se ek key delete karo"""
    try:
        cache.delete(key)
        logger.info(f"Cache DELETE: {key}")
    except Exception as e:
        logger.error(f"Cache DELETE error: {e}")


def cache_delete_pattern(pattern):
    """Pattern se match karne wali saari keys delete karo"""
    try:
        from django_redis import get_redis_connection
        redis_conn = get_redis_connection('default')
        # Prefix ke saath pattern
        full_pattern = f"freelancehub:{pattern}"
        keys = redis_conn.keys(full_pattern)
        if keys:
            redis_conn.delete(*keys)
            logger.info(f"Cache CLEAR pattern: {pattern} ({len(keys)} keys deleted)")
    except Exception as e:
        logger.error(f"Cache DELETE PATTERN error: {e}")


def cache_clear_all():
    """Saara cache clear karo"""
    try:
        cache.clear()
        logger.info("Cache CLEARED ALL")
    except Exception as e:
        logger.error(f"Cache CLEAR ALL error: {e}")