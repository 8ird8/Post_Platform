import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

function CardSkeleton() {
  return (
    <>
      <div className=' grid-10 '>
      <div className="rounded-2xl mt-28 mb-6 w-cus m-auto relative left-14  border-gray-200 border-2 shadow-lg">
        <div className="flex justify-start gap-4 p-2">
          <Skeleton variant="circular" width={64} height={64} />
          <div className='my-auto'>
            <Skeleton variant="text" width={210} height={24} />
            <Skeleton variant="text" width={150} height={20} />
          </div>
        </div>
        <Skeleton variant="text" width={150} height={35} className='m-auto' />
        <Skeleton variant="rectangular" height={318} width={570} className="mx-auto rounded-2xl my-2" />
        
        <Box sx={{ px: 6, py: 4 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
        <div className='flex justify-between p-2'>
        <Skeleton variant="rectangular" height={30} width={30}  />
        <Skeleton variant="rectangular" height={30} width={30}  />
        </div>
      </div>
      <div className="rounded-2xl mt-28 mb-6 w-cus m-auto relative left-14  border-gray-200 border-2 shadow-lg">
        <div className="flex justify-start gap-4 p-2">
          <Skeleton variant="circular" width={64} height={64} />
          <div>
            <Skeleton variant="text" width={210} height={24} />
            <Skeleton variant="text" width={150} height={20} />
          </div>
        </div>
        <Skeleton variant="text" width={150} height={35} className='m-auto' />
        <Skeleton variant="rectangular" height={318} width={570} className="mx-auto rounded-2xl my-2" />
        
        <Box sx={{ px: 6, py: 4 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
        <div className='flex justify-between p-2'>
        <Skeleton variant="rectangular" height={30} width={30}  />
        <Skeleton variant="rectangular" height={30} width={30}  />
        </div>
      </div>
      </div>
      
    </>
  );
}

export default CardSkeleton;
