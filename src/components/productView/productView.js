import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { routerContext } from '../router';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardInstances } from '../inventoryCardInstances/inventoryCardInstances';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { translate } from '../i18n/i18n';

/**
 * Primary product display component, and config context provider.
 *
 * @memberof Components
 * @module ProductView
 * @property {module} ProductViewContext
 * @property {module} ProductViewMissing
 */

/**
 * ToDo: review removing the "useCallback" once the routing updates are in place
 */
/**
 * Display products.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useRouteDetail
 * @returns {React.ReactNode}
 */
const ProductView = ({ t, useRouteDetail: useAliasRouteDetail }) => {
  const { firstMatch, productGroup } = useAliasRouteDetail();

  const renderProduct = useCallback(() => {
    const updated = config => {
      const { initialInventoryFilters, initialSubscriptionsInventoryFilters, productId, viewId } = config;

      if (!productId || !viewId) {
        return null;
      }

      return (
        <ProductViewContext.Provider value={config} key={`product_${productId}`}>
          <PageMessages>
            <BannerMessages />
          </PageMessages>
          <PageToolbar>
            <Toolbar />
          </PageToolbar>
          <PageSection className="curiosity-page-section__graphs">
            <GraphCard />
          </PageSection>
          <PageSection className="curiosity-page-section__tabs">
            <InventoryTabs
              isDisabled={
                (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
              }
            >
              {!helpers.UI_DISABLED_TABLE_INSTANCES && initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_instances_${productId}`}
                  title={t('curiosity-inventory.tabInstances', { context: [productId] })}
                >
                  <InventoryCardInstances />
                </InventoryTab>
              )}
              {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && initialSubscriptionsInventoryFilters && (
                <InventoryTab
                  key={`inventory_subs_${productId}`}
                  title={t('curiosity-inventory.tabSubscriptions', { context: [productId] })}
                >
                  <InventoryCardSubscriptions />
                </InventoryTab>
              )}
            </InventoryTabs>
          </PageSection>
        </ProductViewContext.Provider>
      );
    };

    return updated(firstMatch);
  }, [firstMatch, t]);

  return (
    (productGroup && (
      <PageLayout>
        <PageHeader productLabel={productGroup}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productGroup })}
        </PageHeader>
        <PageColumns>{renderProduct()}</PageColumns>
      </PageLayout>
    )) ||
    null
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.propTypes = {
  t: PropTypes.func,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.defaultProps = {
  t: translate,
  useRouteDetail: routerContext.useRouteDetail
};

export { ProductView as default, ProductView };
