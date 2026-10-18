import type { Lang } from '@/lib/types';
import type { RouteState } from '@/lib/routing';
import { routeLabels } from '@/lib/routing';
import { Icon } from './Icon';
export default function RouteSummary({route,lang,compact=false}:{route:RouteState;lang:Lang;compact?:boolean}) {
  if(route.status==='idle')return null;
  const labels=route.data?routeLabels(route.data,lang):null;
  const note=lang==='ar'?'وقت قيادة تقديري بدون زحمة لحظية':'Estimated driving time without live traffic';
  return <span className={compact?'route-badge':'route-summary'} role="status" title={note}>
    {!compact&&<Icon name="pin" size={16}/>}
    <Icon name="car" size={16}/>
    {labels?<>{compact?<><span>{labels.time}</span><span aria-hidden="true">|</span><span>{labels.distance}</span></>:<><span>{labels.distance}</span><Icon name="clock" size={16}/><span>{labels.time}</span></>}</>:<span>{route.status==='loading'?(lang==='ar'?'حساب الطريق…':'Calculating route…'):(lang==='ar'?'المسار غير متاح حاليًا':'Route unavailable')}</span>}
  </span>;
}
