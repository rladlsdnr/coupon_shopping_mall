import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { sentenceCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  Select,
} from '@mui/material';
// routes
// utils
import { fShortenNumber, fCurrency } from 'src/utils/formatNumber';
// _mock
// components
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify/Iconify';
import { IncrementerButton } from 'src/components/custom-input';
import { ColorSinglePicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  product: PropTypes.object,
  onGotoStep: PropTypes.func,
};

export default function ProductDetailsSummary({ product, onAddCart, onGotoStep, ...other }) {
  const cart = []
  const { push } = useRouter();

  const {
    id,
    name,
    sizes=[],
    price,
    cover,
    status,
    colors=[],
    available,
    priceSale,
    rating,
    totalReview,
    inventoryType,
  } = product;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const isMaxQuantity =
    cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    cover,
    available,
    price,
    colors: colors[0],
    size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = async (data) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          colors: [values.colors],
          subtotal: data.price * data.quantity,
        });
      }
      onGotoStep(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        colors: [values.colors],
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <Stack
        spacing={3}
        sx={{
          p: (theme) => ({
            md: theme.spacing(5, 5, 0, 2),
          }),
        }}
        {...other}
      >
        <Stack spacing={2}>
          <Label
            variant="soft"
            color={inventoryType === 'in_stock' ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase', mr: 'auto' }}
          >
            {sentenceCase(inventoryType || '')}
          </Label>

          <Typography
            variant="overline"
            component="div"
            sx={{
              color: status === 'sale' ? 'error.main' : 'info.main',
            }}
          >
            {status}
          </Typography>

          <Typography variant="h5">{name}</Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={rating} precision={0.1} readOnly />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(totalReview)}
              리뷰)
            </Typography>
          </Stack>

          <Typography variant="h4">
            {priceSale && (
              <Box
                component="span"
                sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
              >
                {fCurrency(priceSale)}
              </Box>
            )}

            {fCurrency(price)}
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">Color</Typography>

          <Controller
            name="colors"
            control={control}
            render={({ field }) => (
              <ColorSinglePicker
                colors={colors}
                value={field.value}
                onChange={field.onChange}
                sx={{
                  ...(colors.length > 4 && {
                    maxWidth: 144,
                    justifyContent: 'flex-end',
                  }),
                }}
              />
            )}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ height: 40, lineHeight: '40px', flexGrow: 1 }}>
            Size
          </Typography>

          <Select
            name="size"
            size="small"
            helperText={
              <Link underline="always" color="inherit">
                Size Chart
              </Link>
            }
            sx={{
              maxWidth: 96,
              '& .MuiFormHelperText-root': {
                mx: 0,
                mt: 1,
                textAlign: 'right',
              },
            }}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ height: 36, lineHeight: '36px' }}>
            Quantity
          </Typography>

          <Stack spacing={1}>
            <IncrementerButton
              name="quantity"
              quantity={values.quantity}
              disabledDecrease={values.quantity <= 1}
              disabledIncrease={values.quantity >= available}
              onIncrease={() => setValue('quantity', values.quantity + 1)}
              onDecrease={() => setValue('quantity', values.quantity - 1)}
            />

            <Typography
              variant="caption"
              component="div"
              sx={{ textAlign: 'right', color: 'text.secondary' }}
            >
              Available: {available}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            장바구니
          </Button>

          <Button fullWidth size="large" type="submit" variant="contained">
            바로구매
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          {[].map((social) => (
            <IconButton key={social.name}>
              <Iconify icon={social.icon} />
            </IconButton>
          ))}
        </Stack>
      </Stack>
    </form>
  );
}
